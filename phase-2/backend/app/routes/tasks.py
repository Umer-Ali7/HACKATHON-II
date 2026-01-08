from datetime import datetime
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from app.db import get_session
from app.middleware import get_current_user_id
from app.models import Task
from app.schemas import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task"
)
def create_task(
    task_data: TaskCreate,
    user_id: Annotated[str, Depends(get_current_user_id)],
    session: Annotated[Session, Depends(get_session)]
) -> Task:
    """
    Create a new task for the authenticated user.

    - **title**: Task title (required, max 200 characters)
    - **description**: Task description (optional, max 1000 characters)

    Returns the created task with generated ID and timestamps.
    """
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.get(
    "",
    response_model=list[TaskResponse],
    summary="List all tasks for the authenticated user"
)
def list_tasks(
    user_id: Annotated[str, Depends(get_current_user_id)],
    session: Annotated[Session, Depends(get_session)],
    status_filter: Optional[str] = Query(
        default=None,
        alias="status",
        description="Filter by status: 'pending', 'completed', or omit for all"
    )
) -> list[Task]:
    """
    List all tasks for the authenticated user, optionally filtered by status.

    - **status**: Optional filter ('pending' or 'completed')

    Returns tasks sorted by creation date (newest first).
    """
    # Base query filtered by authenticated user
    statement = select(Task).where(Task.user_id == user_id)

    # Apply status filter if provided
    if status_filter == "pending":
        statement = statement.where(Task.completed == False)
    elif status_filter == "completed":
        statement = statement.where(Task.completed == True)
    elif status_filter is not None and status_filter != "all":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status filter. Must be 'pending', 'completed', or 'all'"
        )

    # Sort by creation date (newest first)
    statement = statement.order_by(Task.created_at.desc())

    tasks = session.exec(statement).all()
    return tasks


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Get a single task"
)
def get_task(
    task_id: int,
    user_id: Annotated[str, Depends(get_current_user_id)],
    session: Annotated[Session, Depends(get_session)]
) -> Task:
    """
    Get a single task by ID.

    - **task_id**: The task ID

    Returns 404 if task not found or doesn't belong to authenticated user.
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify task belongs to authenticated user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    return task


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Update a task"
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user_id: Annotated[str, Depends(get_current_user_id)],
    session: Annotated[Session, Depends(get_session)]
) -> Task:
    """
    Update a task's title and/or description.

    - **task_id**: The task ID
    - **title**: New title (optional)
    - **description**: New description (optional)

    Returns 404 if task not found or doesn't belong to authenticated user.
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify task belongs to authenticated user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Update fields if provided
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description

    # Update timestamp
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.patch(
    "/{task_id}/complete",
    response_model=TaskResponse,
    summary="Toggle task completion status"
)
def toggle_task_completion(
    task_id: int,
    user_id: Annotated[str, Depends(get_current_user_id)],
    session: Annotated[Session, Depends(get_session)]
) -> Task:
    """
    Toggle a task's completion status.

    - **task_id**: The task ID

    Returns 404 if task not found or doesn't belong to authenticated user.
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify task belongs to authenticated user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task"
)
def delete_task(
    task_id: int,
    user_id: Annotated[str, Depends(get_current_user_id)],
    session: Annotated[Session, Depends(get_session)]
) -> None:
    """
    Permanently delete a task.

    - **task_id**: The task ID

    Returns 404 if task not found or doesn't belong to authenticated user.
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify task belongs to authenticated user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    session.delete(task)
    session.commit()
