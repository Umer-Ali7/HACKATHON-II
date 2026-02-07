"""Chat endpoint for the Todo AI Chatbot."""

import logging
import time
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.database import get_session
from app.models import Conversation, Message

logger = logging.getLogger(__name__)

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


class ChatRequest(BaseModel):
    """Request body for the chat endpoint."""

    message: str = Field(min_length=1, max_length=10000)
    conversation_id: Optional[int] = None


class ToolCallRecord(BaseModel):
    """Record of an MCP tool invocation."""

    tool: str
    parameters: dict[str, Any]
    result: dict[str, Any]


class ChatResponse(BaseModel):
    """Response body from the chat endpoint."""

    conversation_id: int
    response: str
    tool_calls: list[ToolCallRecord]


class ErrorResponse(BaseModel):
    """Error response body."""

    error: str
    detail: str


async def _get_or_create_conversation(
    session: AsyncSession, user_id: str, conversation_id: Optional[int]
) -> Conversation:
    """Load an existing conversation or create a new one."""
    if conversation_id is not None:
        stmt = select(Conversation).where(
            Conversation.id == conversation_id, Conversation.user_id == user_id
        )
        result = await session.execute(stmt)
        conversation = result.scalar_one_or_none()
        if conversation is None:
            raise HTTPException(
                status_code=400,
                detail="Conversation not found or does not belong to this user.",
            )
        return conversation

    conversation = Conversation(user_id=user_id)
    session.add(conversation)
    await session.commit()
    await session.refresh(conversation)
    return conversation


async def _fetch_history(session: AsyncSession, conversation_id: int) -> list[dict]:
    """Fetch the last 50 messages for a conversation, ordered chronologically."""
    stmt = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(50)
    )
    result = await session.execute(stmt)
    messages = list(reversed(result.scalars().all()))
    return [{"role": m.role, "content": m.content} for m in messages]


async def _save_message(
    session: AsyncSession, conversation_id: int, user_id: str, role: str, content: str
) -> Message:
    """Persist a message to the database."""
    msg = Message(
        conversation_id=conversation_id,
        user_id=user_id,
        role=role,
        content=content,
    )
    session.add(msg)
    await session.commit()
    await session.refresh(msg)
    return msg


@router.post("/api/{user_id}/chat", response_model=ChatResponse)
@limiter.limit("100/minute")
async def chat(
    user_id: str,
    body: ChatRequest,
    request: Request,
    session: AsyncSession = Depends(get_session),
) -> ChatResponse:
    """Process a natural language chat message through the AI todo agent."""
    if not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id must not be empty.")

    start_time = time.time()

    conversation = await _get_or_create_conversation(session, user_id, body.conversation_id)
    history = await _fetch_history(session, conversation.id)
    await _save_message(session, conversation.id, user_id, "user", body.message)

    # Update conversation timestamp
    conversation.updated_at = datetime.now(timezone.utc)
    session.add(conversation)
    await session.commit()

    # Call agent (imported lazily to avoid circular imports at module level)
    from app.agents.todo_agent import run_agent

    agent_response, tool_calls = await run_agent(user_id, history, body.message)

    await _save_message(session, conversation.id, user_id, "assistant", agent_response)

    elapsed = time.time() - start_time
    logger.info(
        "Chat request user=%s conv=%s tools=%s latency=%.2fs",
        user_id,
        conversation.id,
        [tc["tool"] for tc in tool_calls],
        elapsed,
    )

    return ChatResponse(
        conversation_id=conversation.id,
        response=agent_response,
        tool_calls=[ToolCallRecord(**tc) for tc in tool_calls],
    )
