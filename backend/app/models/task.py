from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, Index


class Task(SQLModel, table=True):
    """Task model for database"""

    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(
        index=True,
        foreign_key="users.id",
        nullable=False,
        description="User who owns this task"
    )
    title: str = Field(
        max_length=200,
        nullable=False,
        description="Task title"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Task description"
    )
    completed: bool = Field(
        default=False,
        index=True,
        description="Whether task is completed"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Timestamp when task was created"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Timestamp when task was last updated"
    )

    __table_args__ = (
        # Composite index for filtering tasks by user and completion status
        Index("ix_tasks_user_id_completed", "user_id", "completed"),
    )
