"""Vercel serverless entry point for FastAPI."""

# This import must be at top level so Vercel's build system installs all deps
from app.main import app  # noqa: F401
