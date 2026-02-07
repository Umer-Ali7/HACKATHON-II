"""MCP tool: Mark a task as completed."""

from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.task import Task


async def complete_task(session: AsyncSession, user_id: str, task_id: int) -> dict:
    """Mark the specified task as completed.

    Args:
        session: Async database session.
        user_id: Owner of the task.
        task_id: ID of the task to complete.

    Returns:
        Dict with task_id, title, and status, or error details.
    """
    stmt = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(stmt)
    task = result.scalar_one_or_none()

    if task is None:
        return {"error": "not_found", "detail": f"Task {task_id} not found for this user."}

    if task.completed:
        return {
            "error": "already_completed",
            "detail": f"Task '{task.title}' is already completed.",
        }

    task.completed = True
    task.updated_at = datetime.now(timezone.utc)
    session.add(task)
    await session.commit()
    return {"task_id": task.id, "title": task.title, "status": "completed"}
