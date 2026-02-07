"""Async database engine and session dependency."""

import logging
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.core.config import settings

logger = logging.getLogger(__name__)

_engine_kwargs = {"echo": False, "pool_pre_ping": True}
if settings.ENVIRONMENT == "production":
    _engine_kwargs["pool_size"] = 5
    _engine_kwargs["max_overflow"] = 0

engine = create_async_engine(settings.DATABASE_URL, **_engine_kwargs)

async_session_factory = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def create_db_and_tables() -> None:
    """Create all database tables on startup if they don't exist."""
    logger.info("Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    logger.info("Database tables created successfully.")


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Yield an async database session."""
    async with async_session_factory() as session:
        yield session
