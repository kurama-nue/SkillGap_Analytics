"""
Custom exception types and FastAPI exception handlers.
"""
from fastapi import Request
from fastapi.responses import JSONResponse


class RAGRetrievalError(Exception):
    """Raised when pgvector similarity search returns no usable results."""

    def __init__(self, query: str):
        self.query = query
        super().__init__(f"No relevant documents found for query: '{query}'")


class EmbeddingServiceError(Exception):
    """Raised when the OpenAI embedding call fails."""

    def __init__(self, detail: str):
        super().__init__(detail)


class DatabaseConnectionError(Exception):
    """Raised when the async DB session cannot be established."""

    def __init__(self, detail: str):
        super().__init__(detail)


# ── FastAPI exception handlers ────────────────────────────────────────────────

async def rag_retrieval_exception_handler(
    request: Request, exc: RAGRetrievalError
) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "error": "rag_no_results",
            "message": "No relevant knowledge base entries found for your query.",
            "query": exc.query,
        },
    )


async def embedding_service_exception_handler(
    request: Request, exc: EmbeddingServiceError
) -> JSONResponse:
    return JSONResponse(
        status_code=503,
        content={
            "error": "embedding_service_unavailable",
            "message": str(exc),
        },
    )


async def database_connection_exception_handler(
    request: Request, exc: DatabaseConnectionError
) -> JSONResponse:
    return JSONResponse(
        status_code=503,
        content={
            "error": "database_unavailable",
            "message": "Database connection failed. Please try again shortly.",
        },
    )


async def generic_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": "An unexpected error occurred.",
        },
    )
