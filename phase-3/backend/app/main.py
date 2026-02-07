"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy.exc import SQLAlchemyError

from app.api.routes.auth import router as auth_router
from app.api.routes.chat import router as chat_router
from app.api.routes.conversations import router as conversations_router
from app.api.routes.profile import router as profile_router
from app.api.routes.stats import router as stats_router
from app.api.routes.tasks import router as tasks_router
from app.core.config import settings
from app.core.database import create_db_and_tables

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan: create tables on startup."""
    logger.info("Starting Todo AI Chatbot...")
    await create_db_and_tables()
    logger.info("Database initialized!")
    yield
    logger.info("Shutting down...")


app = FastAPI(title="Todo AI Chatbot", version="1.0.0", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

_origins = [o.strip() for o in settings.FRONTEND_URL.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(tasks_router)
app.include_router(stats_router)
app.include_router(profile_router)
app.include_router(conversations_router)


@app.get("/health")
async def health_check() -> dict:
    """Return service health status."""
    return {"status": "ok"}


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    """Handle database errors with a generic 503 response."""
    logger.error("Database error: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=503,
        content={
            "error": "service_unavailable",
            "detail": "Service temporarily unavailable. Please try again.",
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle unexpected errors with a generic 500 response."""
    logger.error("Unhandled error: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_error",
            "detail": "An unexpected error occurred. Please try again.",
        },
    )
