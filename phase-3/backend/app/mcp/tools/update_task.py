"""MCP tool: Update a task's title or description."""

from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.task import Task


async def update_task(
    session: AsyncSession,
    user_id: str,
    task_id: int,
    new_title: str | None = None,
    new_description: str | None = None,
) -> dict:
    """Update the title and/or description of a task.

    Args:
        session: Async database session.
        user_id: Owner of the task.
        task_id: ID of the task to update.
        new_title: New title (optional).
        new_description: New description (optional).

    Returns:
        Dict with task_id, old/new values, and status, or error details.
    """
    stmt = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(stmt)
    task = result.scalar_one_or_none()

    if task is None:
        return {"error": "not_found", "detail": f"Task {task_id} not found for this user."}

    old_title = task.title
    if new_title is not None:
        task.title = new_title.strip()
    if new_description is not None:
        task.description = new_description.strip()
    task.updated_at = datetime.now(timezone.utc)
    session.add(task)
    await session.commit()
    return {
        "task_id": task.id,
        "old_title": old_title,
        "new_title": task.title,
        "status": "updated",
    }
