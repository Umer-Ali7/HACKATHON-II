"""User model representing a registered account."""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, DateTime
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """A registered user account."""

    id: str = Field(primary_key=True)
    email: str = Field(max_length=255, unique=True, nullable=False, index=True)
    hashed_password: str = Field(nullable=False)
    display_name: Optional[str] = Field(default=None, max_length=100)
    theme_preference: Optional[str] = Field(default=None, max_length=10)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
