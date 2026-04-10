"""
FastAPI application entrypoint.
Registers routers, middleware, exception handlers, and lifecycle events.
"""
import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import engine
from app.models.db_models import Base
from app.routers import analytics, engine as engine_router
from app.utils.exceptions import (
    DatabaseConnectionError,
    EmbeddingServiceError,
    RAGRetrievalError,
    database_connection_exception_handler,
    embedding_service_exception_handler,
    generic_exception_handler,
    rag_retrieval_exception_handler,
)
from app.utils.logger import RequestIDMiddleware, configure_logging

# ── Bootstrap ─────────────────────────────────────────────────────────────────
settings = get_settings()
configure_logging(level="DEBUG" if settings.app_env == "development" else "INFO")
logger = structlog.get_logger(__name__)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="SkillGap Analytics API",
    description=(
        "AI-Powered HR Skill-Gap Analytics platform. "
        "Provides RAG-based semantic search and 3D skill visualization data."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── Middleware ─────────────────────────────────────────────────────────────────
app.add_middleware(RequestIDMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Exception Handlers ─────────────────────────────────────────────────────────
app.add_exception_handler(RAGRetrievalError, rag_retrieval_exception_handler)          # type: ignore[arg-type]
app.add_exception_handler(EmbeddingServiceError, embedding_service_exception_handler)   # type: ignore[arg-type]
app.add_exception_handler(DatabaseConnectionError, database_connection_exception_handler)  # type: ignore[arg-type]
app.add_exception_handler(Exception, generic_exception_handler)                         # type: ignore[arg-type]

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(engine_router.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")

# ── Lifecycle ─────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def on_startup() -> None:
    logger.info("skillgap_api_starting", env=settings.app_env)
    # Create tables (dev only — use Alembic/Supabase migrations in production)
    if settings.app_env == "development":
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("database_tables_ensured")
        except Exception as exc:
            logger.warning(
                "database_unavailable_at_startup",
                error=str(exc),
                hint="Start Postgres with: docker-compose up -d postgres",
            )



@app.on_event("shutdown")
async def on_shutdown() -> None:
    await engine.dispose()
    logger.info("skillgap_api_shutdown")


# ── Health ─────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "ok", "version": "1.0.0", "env": settings.app_env}


@app.get("/", tags=["System"])
async def root():
    return {
        "service": "SkillGap Analytics API",
        "docs": "/docs",
        "health": "/health",
    }
