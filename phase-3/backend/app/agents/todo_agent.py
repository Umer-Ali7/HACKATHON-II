"""Todo AI agent using OpenAI Agents SDK with Groq provider."""

import json
import logging
import os
import time

from agents import Agent, OpenAIChatCompletionsModel, Runner, function_tool, set_tracing_disabled
from openai import AsyncOpenAI

from app.core.config import settings
from app.core.database import async_session_factory

logger = logging.getLogger(__name__)

# Disable tracing since we're not using OpenAI's API directly
set_tracing_disabled(True)

# Initialize Groq client
groq_client = AsyncOpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

AGENT_INSTRUCTIONS = """You are a helpful todo list assistant. Your job is to help users manage their tasks through natural language.

When the user mentions:
- Adding/creating/remembering something → use add_task_tool
- Showing/listing/viewing tasks → use list_tasks_tool
- Completing/finishing/done with a task → use complete_task_tool
- Deleting/removing/canceling a task → use delete_task_tool
- Updating/changing/editing a task → use update_task_tool

Always:
1. Confirm actions with friendly messages
2. Use the exact task ID from list_tasks_tool when needed
3. Ask for clarification if the user's intent is ambiguous
4. Handle errors gracefully and suggest alternatives
5. If no task-related intent is detected, respond conversationally

When listing tasks, format them as a numbered list with status indicators."""

MODEL = "llama-3.3-70b-versatile"

# Global to hold the current user_id for tool calls (set per request)
_current_user_id: str = ""
# Global to collect tool call records per request
_tool_call_records: list[dict] = []


# --- @function_tool wrappers (T018) ---

@function_tool
async def add_task_tool(title: str, description: str = "") -> str:
    """Create a new task for the user.

    Args:
        title: Title of the task to create.
        description: Optional description for the task.
    """
    from app.mcp.tools.add_task import add_task

    async with async_session_factory() as session:
        result = await add_task(session, user_id=_current_user_id, title=title, description=description or None)

    _tool_call_records.append({
        "tool": "add_task_tool",
        "parameters": {"user_id": _current_user_id, "title": title, "description": description},
        "result": result,
    })
    return json.dumps(result)


@function_tool
async def list_tasks_tool(status_filter: str = "all") -> str:
    """List all tasks for the user.

    Args:
        status_filter: Filter by status (all, pending, completed). Defaults to all.
    """
    from app.mcp.tools.list_tasks import list_tasks

    async with async_session_factory() as session:
        result = await list_tasks(session, user_id=_current_user_id)

    _tool_call_records.append({
        "tool": "list_tasks_tool",
        "parameters": {"user_id": _current_user_id},
        "result": result,
    })
    return json.dumps(result)


@function_tool
async def complete_task_tool(task_id: int) -> str:
    """Mark a task as completed.

    Args:
        task_id: The ID of the task to complete.
    """
    from app.mcp.tools.complete_task import complete_task

    async with async_session_factory() as session:
        result = await complete_task(session, user_id=_current_user_id, task_id=task_id)

    _tool_call_records.append({
        "tool": "complete_task_tool",
        "parameters": {"user_id": _current_user_id, "task_id": task_id},
        "result": result,
    })
    return json.dumps(result)


@function_tool
async def delete_task_tool(task_id: int) -> str:
    """Delete a task permanently.

    Args:
        task_id: The ID of the task to delete.
    """
    from app.mcp.tools.delete_task import delete_task

    async with async_session_factory() as session:
        result = await delete_task(session, user_id=_current_user_id, task_id=task_id)

    _tool_call_records.append({
        "tool": "delete_task_tool",
        "parameters": {"user_id": _current_user_id, "task_id": task_id},
        "result": result,
    })
    return json.dumps(result)


@function_tool
async def update_task_tool(task_id: int, new_title: str = "", new_description: str = "") -> str:
    """Update a task's title or description.

    Args:
        task_id: The ID of the task to update.
        new_title: New title for the task.
        new_description: New description for the task.
    """
    from app.mcp.tools.update_task import update_task

    async with async_session_factory() as session:
        result = await update_task(
            session,
            user_id=_current_user_id,
            task_id=task_id,
            new_title=new_title or None,
            new_description=new_description or None,
        )

    _tool_call_records.append({
        "tool": "update_task_tool",
        "parameters": {"user_id": _current_user_id, "task_id": task_id, "new_title": new_title, "new_description": new_description},
        "result": result,
    })
    return json.dumps(result)


# --- Groq model integration ---

def _create_agent() -> Agent:
    """Create the todo agent with Groq model and tool functions."""
    # Use OpenAI Agents SDK with Groq provider
    model = OpenAIChatCompletionsModel(
        openai_client=groq_client,
        model=MODEL,
    )

    return Agent(
        name="Todo Assistant",
        instructions=AGENT_INSTRUCTIONS,
        model=model,
        tools=[add_task_tool, list_tasks_tool, complete_task_tool, delete_task_tool, update_task_tool],
    )


async def run_agent(
    user_id: str, conversation_history: list[dict], new_message: str
) -> tuple[str, list[dict]]:
    """Run the AI agent and return its response with tool call records.

    Args:
        user_id: The user making the request.
        conversation_history: Prior messages in OpenAI format.
        new_message: The new user message.

    Returns:
        Tuple of (response_text, list_of_tool_call_records).
    """
    global _current_user_id, _tool_call_records
    _current_user_id = user_id
    _tool_call_records = []

    agent = _create_agent()

    # Build input messages for the agent
    input_messages = []
    for msg in conversation_history:
        input_messages.append({"role": msg["role"], "content": msg["content"]})
    input_messages.append({"role": "user", "content": new_message})

    try:
        start = time.time()
        result = await Runner.run(agent, input=input_messages)
        logger.info("Agent SDK run completed in %.2fs", time.time() - start)
        response_text = result.final_output or ""
    except Exception as e:
        logger.error("Agent SDK error: %s", e)
        return (
            "I'm having trouble connecting to my AI brain right now. Please try again in a moment.",
            [],
        )

    return response_text, _tool_call_records
