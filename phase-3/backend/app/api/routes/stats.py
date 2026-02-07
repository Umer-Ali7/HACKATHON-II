"""Stats endpoint for dashboard."""

import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.api.schemas import StatsResponse, TaskResponse
from app.core.database import get_session
from app.models import Task

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.get("/api/{user_id}/stats", response_model=StatsResponse)
@limiter.limit("100/minute")
async def get_stats(
    user_id: str,
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """Get task statistics and 7-day activity."""
    total_stmt = select(func.count()).select_from(Task).where(Task.user_id == user_id)
    total = (await session.execute(total_stmt)).scalar() or 0

    completed_stmt = (
        select(func.count())
        .select_from(Task)
        .where(Task.user_id == user_id, Task.completed == True)
    )
    completed = (await session.execute(completed_stmt)).scalar() or 0
    pending = total - completed

    recent_stmt = (
        select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc()).limit(5)
    )
    recent_result = await session.execute(recent_stmt)
    recent_tasks = [
        TaskResponse.model_validate(t, from_attributes=True) for t in recent_result.scalars().all()
    ]

    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)
    activity_stmt = (
        select(
            func.date(Task.updated_at).label("date"),
            func.count().label("count"),
        )
        .where(
            Task.user_id == user_id,
            Task.completed == True,
            Task.updated_at >= seven_days_ago,
        )
        .group_by(func.date(Task.updated_at))
        .order_by(func.date(Task.updated_at))
    )
    activity_result = await session.execute(activity_stmt)
    activity_rows = activity_result.all()

    activity = []
    for i in range(7):
        day = (now - timedelta(days=6 - i)).date()
        count = 0
        for row in activity_rows:
            if str(row.date) == str(day):
                count = row.count
                break
        activity.append({"date": str(day), "count": count})

    return StatsResponse(
        total=total,
        pending=pending,
        completed=completed,
        recent_tasks=recent_tasks,
        activity=activity,
    )
