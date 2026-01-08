from sqlmodel import Session, create_engine
from sqlalchemy.pool import NullPool
from app.config import settings

# Create engine with NullPool for Neon (serverless PostgreSQL)
# Neon handles connection pooling, so we don't need SQLAlchemy pooling
engine = create_engine(
    settings.database_url,
    poolclass=NullPool,
    echo=settings.debug,
    connect_args={"sslmode": "require"}  # Neon requires SSL
)


def get_session():
    """Dependency for FastAPI to get database session"""
    with Session(engine) as session:
        yield session
