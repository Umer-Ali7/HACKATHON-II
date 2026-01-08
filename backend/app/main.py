from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import tasks_router
from app.routes.auth import router as auth_router

# Initialize FastAPI application
app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    description="Multi-user Todo application API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],  # Specific origin for security
    allow_credentials=True,  # Allow cookies and Authorization headers
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(tasks_router)


@app.get("/", tags=["health"])
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": "1.0.0"
    }


@app.get("/health", tags=["health"])
def health():
    """Alternative health check endpoint"""
    return {"status": "ok"}
