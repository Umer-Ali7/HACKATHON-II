from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.config import settings

# Security scheme for JWT Bearer token
security = HTTPBearer()


def get_current_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> str:
    """
    Dependency to extract and verify JWT token, returning user_id.

    This enforces authentication on all endpoints that use it.
    The user_id is extracted from the JWT payload and returned
    for use in filtering database queries.

    Args:
        credentials: HTTP Bearer token from Authorization header

    Returns:
        user_id: The authenticated user's ID from the JWT payload

    Raises:
        HTTPException: 401 if token is invalid, expired, or missing user_id
    """
    token = credentials.credentials

    try:
        # Decode JWT token using the same secret as Better Auth
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=[settings.jwt_algorithm]
        )

        # Extract user_id from payload
        # Better Auth stores user ID in 'sub' claim (standard JWT claim)
        user_id: str | None = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload missing user ID",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user_id

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
