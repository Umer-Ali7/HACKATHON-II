from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """
    User model matching Better Auth schema.

    This table is managed by Better Auth - do NOT modify through our application.
    This model exists only to inform SQLModel/Alembic about the table structure
    so that foreign keys from tasks.user_id can reference users.id.
    """

    __tablename__ = "users"

    id: str = Field(primary_key=True, description="User ID (UUID)")
    email: str = Field(unique=True, nullable=False, description="User email address")
    email_verified: bool = Field(default=False, description="Email verification status")
    name: Optional[str] = Field(default=None, description="User display name")
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Account creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Last update timestamp"
    )

    # Note: Better Auth manages additional fields like password_hash, sessions, etc.
    # We only define the fields needed for our application's foreign key relationships
