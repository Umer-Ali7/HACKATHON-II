"""Conversation endpoints."""

import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.api.schemas import ConversationResponse, MessageResponse
from app.core.database import get_session
from app.models import Conversation, Message

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.get("/api/{user_id}/conversations")
@limiter.limit("100/minute")
async def list_conversations(
    user_id: str,
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """List user conversations."""
    stmt = (
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
    )
    result = await session.execute(stmt)
    conversations = result.scalars().all()

    items = []
    for conv in conversations:
        count_stmt = (
            select(func.count()).select_from(Message).where(Message.conversation_id == conv.id)
        )
        count = (await session.execute(count_stmt)).scalar() or 0

        last_msg_stmt = (
            select(Message.content)
            .where(Message.conversation_id == conv.id)
            .order_by(Message.created_at.desc())
            .limit(1)
        )
        last_msg = (await session.execute(last_msg_stmt)).scalar()

        items.append(
            ConversationResponse(
                id=conv.id,
                created_at=conv.created_at,
                message_count=count,
                last_message_preview=last_msg[:100] if last_msg else None,
            )
        )

    return {"conversations": items}


@router.get("/api/{user_id}/conversations/{conversation_id}/messages")
@limiter.limit("100/minute")
async def get_messages(
    user_id: str,
    conversation_id: int,
    request: Request,
    limit: int = 50,
    session: AsyncSession = Depends(get_session),
):
    """Get messages for a conversation."""
    conv_stmt = select(Conversation).where(
        Conversation.id == conversation_id, Conversation.user_id == user_id
    )
    conv_result = await session.execute(conv_stmt)
    if conv_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    clamped_limit = min(max(limit, 1), 100)
    msg_stmt = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .limit(clamped_limit)
    )
    msg_result = await session.execute(msg_stmt)
    messages = msg_result.scalars().all()

    return {
        "messages": [
            MessageResponse(
                id=m.id,
                role=m.role,
                content=m.content,
                tool_calls=m.tool_calls,
                created_at=m.created_at,
            )
            for m in messages
        ]
    }
