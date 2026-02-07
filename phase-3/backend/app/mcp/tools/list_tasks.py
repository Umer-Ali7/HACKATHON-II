"""MCP tool: List all tasks for a user."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.task import Task


async def list_tasks(session: AsyncSession, user_id: str) -> dict:
    """Retrieve all tasks belonging to the specified user.

    Args:
        session: Async database session.
        user_id: Owner of the tasks.

    Returns:
        Dict with tasks list and count.
    """
    stmt = select(Task).where(Task.user_id == user_id).order_by(Task.created_at)
    result = await session.execute(stmt)
    tasks = result.scalars().all()
    return {
        "tasks": [
            {
                "id": t.id,
                "title": t.title,
                "completed": t.completed,
                "created_at": t.created_at.isoformat(),
            }
            for t in tasks
        ],
        "count": len(tasks),
    }
