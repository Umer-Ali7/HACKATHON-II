"""Authentication routes: signup and login with bcrypt password hashing."""

import logging
import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.api.schemas import AuthResponse, LoginRequest, SignupRequest
from app.core.database import get_session
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _hash_password(password: str) -> str:
    """Hash a plain-text password with bcrypt."""
    return pwd_context.hash(password)


def _verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def _email_to_slug(email: str) -> str:
    """Derive a URL-safe user ID slug from an email address."""
    local_part = email.split("@")[0].lower()
    return re.sub(r"[^a-z0-9-]", "-", local_part)


@router.post("/signup", response_model=AuthResponse)
async def signup(
    request: SignupRequest, session: AsyncSession = Depends(get_session)
) -> AuthResponse:
    """Register a new user with bcrypt-hashed password."""
    # Check for duplicate email
    statement = select(User).where(User.email == request.email)
    result = await session.execute(statement)
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Hash password and create user
    hashed_pw = _hash_password(request.password)
    user_id = _email_to_slug(request.email)

    user = User(
        id=user_id,
        email=request.email,
        hashed_password=hashed_pw,
        display_name=request.name,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    logger.info("User created: %s (ID: %s)", user.email, user.id)

    return AuthResponse(
        user_id=user.id,
        email=user.email,
        name=user.display_name,
        token=f"temp_token_{user.id}",
    )


@router.post("/login", response_model=AuthResponse)
async def login(
    request: LoginRequest, session: AsyncSession = Depends(get_session)
) -> AuthResponse:
    """Authenticate a user with email and password."""
    statement = select(User).where(User.email == request.email)
    result = await session.execute(statement)
    user = result.scalars().first()

    if not user:
        logger.info("Login failed: user not found for %s", request.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not _verify_password(request.password, user.hashed_password):
        logger.info("Login failed: password mismatch for %s", request.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    logger.info("Login successful: %s", user.email)

    return AuthResponse(
        user_id=user.id,
        email=user.email,
        name=user.display_name,
        token=f"temp_token_{user.id}",
    )
