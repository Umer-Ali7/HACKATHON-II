"""MCP server setup with all todo task tools."""

from mcp.server.fastmcp import FastMCP

mcp_server = FastMCP("Todo AI Chatbot")


@mcp_server.tool()
async def add_task_tool(user_id: str, title: str, description: str = "") -> str:
    """Create a new task for the user.

    Args:
        user_id: The user who owns this task.
        title: Title of the task to create.
        description: Optional description for the task.
    """
    from app.core.database import async_session_factory
    from app.mcp.tools.add_task import add_task

    async with async_session_factory() as session:
        result = await add_task(session, user_id, title, description or None)
    return str(result)


@mcp_server.tool()
async def list_tasks_tool(user_id: str) -> str:
    """List all tasks for the user.

    Args:
        user_id: The user whose tasks to list.
    """
    from app.core.database import async_session_factory
    from app.mcp.tools.list_tasks import list_tasks

    async with async_session_factory() as session:
        result = await list_tasks(session, user_id)
    return str(result)


@mcp_server.tool()
async def complete_task_tool(user_id: str, task_id: int) -> str:
    """Mark a task as completed.

    Args:
        user_id: The user who owns this task.
        task_id: The ID of the task to complete.
    """
    from app.core.database import async_session_factory
    from app.mcp.tools.complete_task import complete_task

    async with async_session_factory() as session:
        result = await complete_task(session, user_id, task_id)
    return str(result)


@mcp_server.tool()
async def delete_task_tool(user_id: str, task_id: int) -> str:
    """Delete a task permanently.

    Args:
        user_id: The user who owns this task.
        task_id: The ID of the task to delete.
    """
    from app.core.database import async_session_factory
    from app.mcp.tools.delete_task import delete_task

    async with async_session_factory() as session:
        result = await delete_task(session, user_id, task_id)
    return str(result)


@mcp_server.tool()
async def update_task_tool(
    user_id: str, task_id: int, new_title: str = "", new_description: str = ""
) -> str:
    """Update a task's title or description.

    Args:
        user_id: The user who owns this task.
        task_id: The ID of the task to update.
        new_title: New title for the task (leave empty to keep current).
        new_description: New description (leave empty to keep current).
    """
    from app.core.database import async_session_factory
    from app.mcp.tools.update_task import update_task

    async with async_session_factory() as session:
        result = await update_task(
            session, user_id, task_id, new_title or None, new_description or None
        )
    return str(result)
