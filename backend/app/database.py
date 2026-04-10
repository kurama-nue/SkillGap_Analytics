"""
Async SQLAlchemy database session factory.
Provides dependency-injectable sessions for FastAPI endpoints.
"""
from collections.abc import AsyncGenerator
from typing import Annotated

import structlog
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

logger = structlog.get_logger(__name__)
settings = get_settings()

# ── Engine ────────────────────────────────────────────────────────────────────
engine = create_async_engine(
    settings.database_url,
    echo=settings.app_env == "development",
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # heartbeat reconnect on stale connections
)

# ── Session factory ───────────────────────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# ── ORM Base ──────────────────────────────────────────────────────────────────
class Base(DeclarativeBase):
    pass


# ── Dependency ────────────────────────────────────────────────────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that provides an async database session.
    Automatically commits on success and rolls back on exception.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as exc:
            await session.rollback()
            logger.error("database_session_error", error=str(exc))
            raise
        finally:
            await session.close()


# Type alias for cleaner endpoint signatures
DbSession = Annotated[AsyncSession, Depends(get_db)]
