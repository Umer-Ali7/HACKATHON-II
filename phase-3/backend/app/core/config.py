"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from .env file."""

    DATABASE_URL: str
    GROQ_API_KEY: str
    FRONTEND_URL: str = "http://localhost:3000"
    ENVIRONMENT: str = "development"
    AUTH_SECRET: str = "changeme-in-production-at-least-32-chars"
    HUGGINGFACE_MODEL: str = "meta-llama/Llama-3-70b-Instruct"
    HUGGINGFACE_DEVICE: str = "auto"
    HUGGINGFACE_TORCH_DTYPE: str = "float16"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
