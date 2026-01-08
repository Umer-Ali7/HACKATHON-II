import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env" if os.path.exists(".env") else None,
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # Database
    database_url: str

    # Authentication
    better_auth_secret: str
    jwt_algorithm: str = "HS256"
    jwt_token_expire_days: int = 7

    # CORS - comma-separated list of allowed origins
    frontend_url: str = "http://localhost:3000"
    allowed_origins: str = "http://localhost:3000,https://frontend-theta-flax-97.vercel.app"

    # Application
    app_name: str = "Hackathon Todo API"
    debug: bool = False


# Global settings instance
settings = Settings()
