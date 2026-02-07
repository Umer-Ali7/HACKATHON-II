"""Task CRUD endpoints."""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.api.schemas import CreateTaskRequest, TaskResponse, UpdateTaskRequest
from app.core.database import get_session
from app.models import Task

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.get("/api/{user_id}/tasks", response_model=dict)
@limiter.limit("100/minute")
async def list_tasks(
    user_id: str,
    request: Request,
    status: str = "all",
    search: str = "",
    session: AsyncSession = Depends(get_session),
):
    """List tasks with optional status filter and search."""
    stmt = select(Task).where(Task.user_id == user_id)
    if status == "pending":
        stmt = stmt.where(Task.completed == False)
    elif status == "completed":
        stmt = stmt.where(Task.completed == True)
    if search:
        stmt = stmt.where(Task.title.ilike(f"%{search}%"))
    stmt = stmt.order_by(Task.created_at.desc())
    result = await session.execute(stmt)
    tasks = result.scalars().all()
    return {"tasks": [TaskResponse.model_validate(t, from_attributes=True) for t in tasks]}


@router.post("/api/{user_id}/tasks", response_model=TaskResponse, status_code=201)
@limiter.limit("100/minute")
async def create_task(
    user_id: str,
    body: CreateTaskRequest,
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """Create a new task directly."""
    task = Task(
        user_id=user_id,
        title=body.title.strip(),
        description=body.description,
        completed=False,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return TaskResponse.model_validate(task, from_attributes=True)


@router.patch("/api/{user_id}/tasks/{task_id}", response_model=TaskResponse)
@limiter.limit("100/minute")
async def update_task(
    user_id: str,
    task_id: int,
    body: UpdateTaskRequest,
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """Update a task's fields."""
    stmt = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(stmt)
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    if body.title is not None:
        task.title = body.title.strip()
    if body.description is not None:
        task.description = body.description
    if body.completed is not None:
        task.completed = body.completed
    task.updated_at = datetime.now(timezone.utc)
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return TaskResponse.model_validate(task, from_attributes=True)


@router.delete("/api/{user_id}/tasks/{task_id}", status_code=204)
@limiter.limit("100/minute")
async def delete_task(
    user_id: str,
    task_id: int,
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """Delete a task permanently."""
    stmt = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(stmt)
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    await session.delete(task)
    await session.commit()
