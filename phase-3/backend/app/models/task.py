"""Task model representing a todo item."""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, DateTime
from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    """A todo item owned by a user."""

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
