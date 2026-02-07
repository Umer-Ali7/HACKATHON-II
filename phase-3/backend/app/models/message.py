"""Message model representing a single chat message."""

from datetime import datetime, timezone
from typing import Any, Optional

from sqlalchemy import Column, DateTime
from sqlalchemy.types import JSON
from sqlmodel import Field, SQLModel


class Message(SQLModel, table=True):
    """A single message within a conversation. Immutable once created."""

    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id", nullable=False)
    user_id: str = Field(index=True, nullable=False)
    role: str = Field(nullable=False)  # "user" or "assistant"
    content: str = Field(nullable=False)
    tool_calls: Optional[list[dict[str, Any]]] = Field(
        default=None, sa_column=Column(JSON, nullable=True)
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
