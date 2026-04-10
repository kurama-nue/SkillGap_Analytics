"""
Router: /api/v1/engine — RAG-powered semantic HR query endpoint.
"""
import structlog
from fastapi import APIRouter, HTTPException, status

from app.database import DbSession
from app.models.schemas import QueryRequest, RAGResponse
from app.services.rag_service import query_knowledge_base
from app.utils.exceptions import EmbeddingServiceError, RAGRetrievalError

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/engine", tags=["RAG Engine"])


@router.post(
    "/query",
    response_model=RAGResponse,
    status_code=status.HTTP_200_OK,
    summary="Semantic HR Query",
    description=(
        "Takes a natural language HR query, performs cosine similarity search "
        "over the knowledge base using pgvector, and synthesizes an answer with GPT-4o-mini."
    ),
)
async def query_endpoint(
    body: QueryRequest,
    db: DbSession,
) -> RAGResponse:
    """
    POST /api/v1/engine/query

    Request body:
        - query: str  — natural language HR question
        - top_k: int  — number of KB chunks to retrieve (default 5)

    Returns:
        RAGResponse with synthesized answer and source documents.
    """
    logger.info("engine_query_received", query=body.query[:80])

    try:
        result = await query_knowledge_base(db=db, query=body.query, top_k=body.top_k)
        return result

    except RAGRetrievalError as exc:
        logger.warning("rag_no_results", query=body.query)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": "no_results",
                "message": "No relevant knowledge base entries found for your query. "
                           "Try rephrasing or broadening your question.",
                "query": body.query,
            },
        ) from exc

    except EmbeddingServiceError as exc:
        logger.error("embedding_failed", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "embedding_unavailable",
                "message": "The embedding service is currently unavailable. Please retry shortly.",
            },
        ) from exc

    except Exception as exc:
        logger.error("engine_query_unexpected_error", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "internal_error", "message": "An unexpected error occurred."},
        ) from exc
