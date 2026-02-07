"""MCP tool: Delete a task."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.task import Task


async def delete_task(session: AsyncSession, user_id: str, task_id: int) -> dict:
    """Permanently remove the specified task.

    Args:
        session: Async database session.
        user_id: Owner of the task.
        task_id: ID of the task to delete.

    Returns:
        Dict with task_id, title, and status, or error details.
    """
    stmt = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(stmt)
    task = result.scalar_one_or_none()

    if task is None:
        return {"error": "not_found", "detail": f"Task {task_id} not found for this user."}

    title = task.title
    await session.delete(task)
    await session.commit()
    return {"task_id": task_id, "title": title, "status": "deleted"}
