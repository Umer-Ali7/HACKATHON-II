"""Profile endpoints."""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.api.schemas import ProfileResponse, UpdateProfileRequest
from app.core.database import get_session
from app.models import User

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.get("/api/{user_id}/profile", response_model=ProfileResponse)
@limiter.limit("100/minute")
async def get_profile(
    user_id: str,
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """Get user profile."""
    stmt = select(User).where(User.id == user_id)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    return ProfileResponse(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        theme_preference=user.theme_preference,
    )


@router.patch("/api/{user_id}/profile", response_model=ProfileResponse)
@limiter.limit("100/minute")
async def update_profile(
    user_id: str,
    body: UpdateProfileRequest,
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """Update user profile."""
    stmt = select(User).where(User.id == user_id)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    if body.display_name is not None:
        user.display_name = body.display_name
    if body.theme_preference is not None:
        user.theme_preference = body.theme_preference
    user.updated_at = datetime.now(timezone.utc)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return ProfileResponse(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        theme_preference=user.theme_preference,
    )
