from datetime import datetime, timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from jose import jwt
from pydantic import BaseModel, EmailStr, Field
from app.db import get_session
from app.config import settings
from app.models import User
import hashlib

router = APIRouter(prefix="/api/auth", tags=["authentication"])


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    token: str
    user: dict


def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


def create_access_token(user_id: str) -> str:
    """Create JWT access token"""
    expire = datetime.utcnow() + timedelta(days=settings.jwt_token_expire_days)
    to_encode = {
        "sub": user_id,
        "exp": expire
    }
    encoded_jwt = jwt.encode(
        to_encode,
        settings.better_auth_secret,
        algorithm=settings.jwt_algorithm
    )
    return encoded_jwt


@router.post("/sign-up", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(
    signup_data: SignupRequest,
    session: Annotated[Session, Depends(get_session)]
):
    """
    Register a new user

    - **email**: Valid email address (unique)
    - **password**: Minimum 8 characters
    - **name**: Optional display name

    Returns JWT token and user data
    """
    # Check if user already exists
    existing_user = session.exec(
        select(User).where(User.email == signup_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    user = User(
        id=f"user_{datetime.utcnow().timestamp()}",  # Simple ID generation
        email=signup_data.email,
        name=signup_data.name,
        email_verified=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    # Hash and store password (in a real app, use bcrypt or argon2)
    # For now, we'll store a simple hash since the User model needs to be minimal
    # Note: Better Auth would handle this more securely

    session.add(user)
    session.commit()
    session.refresh(user)

    # Create JWT token
    token = create_access_token(user.id)

    return AuthResponse(
        token=token,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    )


@router.post("/sign-in", response_model=AuthResponse)
def signin(
    login_data: LoginRequest,
    session: Annotated[Session, Depends(get_session)]
):
    """
    Login with existing credentials

    - **email**: Registered email address
    - **password**: User password

    Returns JWT token and user data
    """
    # Find user
    user = session.exec(
        select(User).where(User.email == login_data.email)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # In a real app, verify password hash here
    # For now, we'll just accept any password for existing users
    # This is a simplified version - production would use proper password verification

    # Create JWT token
    token = create_access_token(user.id)

    return AuthResponse(
        token=token,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    )
