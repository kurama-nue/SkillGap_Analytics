"""
Application configuration via environment variables (Pydantic Settings).
"""
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    allowed_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/skillgap"
    supabase_url: str = ""
    supabase_service_key: str = ""

    # AI
    openai_api_key: str
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536
    llm_model: str = "gpt-4o-mini"
    rag_top_k: int = 5

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
