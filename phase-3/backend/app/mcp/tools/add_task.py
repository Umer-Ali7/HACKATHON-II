"""MCP tool: Create a new task for a user."""

from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task


async def add_task(
    session: AsyncSession, user_id: str, title: str, description: str | None = None
) -> dict:
    """Create a new task for the specified user.

    Args:
        session: Async database session.
        user_id: Owner of the task.
        title: Task title (required).
        description: Optional task description.

    Returns:
        Dict with task_id, status, and title.
    """
    task = Task(
        user_id=user_id,
        title=title.strip(),
        description=description,
        completed=False,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return {"task_id": task.id, "status": "created", "title": task.title}
