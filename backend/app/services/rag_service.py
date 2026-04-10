"""
RAG service: embed query → pgvector cosine similarity → LLM synthesis.
"""
from typing import Optional

import structlog
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.schemas import RAGResponse, SourceDocument
from app.services.embedding_service import embed_text
from app.utils.exceptions import EmbeddingServiceError, RAGRetrievalError

logger = structlog.get_logger(__name__)
settings = get_settings()

# ── LLM ───────────────────────────────────────────────────────────────────────
_llm = ChatOpenAI(
    model=settings.llm_model,
    temperature=0.2,
    openai_api_key=settings.openai_api_key,
)

# ── Prompt template ───────────────────────────────────────────────────────────
_SYSTEM_PROMPT = """You are an expert HR analyst AI assistant.
Answer the user's question about employees, skills, and skill gaps
using ONLY the provided context documents.

Rules:
- Be concise and specific. Cite employee names, departments, or skill levels when relevant.
- If the context does not contain enough information, say so clearly.
- Do NOT fabricate data or use knowledge outside the provided context.
- Format lists as bullet points when enumerating items.
"""

_prompt = ChatPromptTemplate.from_messages([
    ("system", _SYSTEM_PROMPT),
    ("human", "Context documents:\n{context}\n\nQuestion: {question}"),
])

_chain = _prompt | _llm


# ── Core RAG function ─────────────────────────────────────────────────────────

async def query_knowledge_base(
    db: AsyncSession,
    query: str,
    top_k: int = 5,
) -> RAGResponse:
    """
    Semantic RAG pipeline:
    1. Embed the query
    2. Cosine similarity search in knowledge_base via pgvector
    3. Synthesize answer with LLM

    Args:
        db:     Async SQLAlchemy session.
        query:  Natural language question from HR user.
        top_k:  Number of knowledge base chunks to retrieve.

    Returns:
        RAGResponse with answer, sources, and metadata.

    Raises:
        EmbeddingServiceError: If OpenAI embedding fails.
        RAGRetrievalError:     If no documents are retrieved.
    """
    logger.info("rag_query_started", query=query[:100], top_k=top_k)

    # Step 1 — Embed the query
    query_embedding: list[float] = await embed_text(query)

    # Step 2 — pgvector cosine similarity search
    # 1 - cosine_distance = cosine similarity
    similarity_sql = text("""
        SELECT
            id,
            content,
            source,
            doc_type,
            metadata,
            1 - (embedding <=> CAST(:embedding AS vector)) AS similarity
        FROM knowledge_base
        ORDER BY embedding <=> CAST(:embedding AS vector)
        LIMIT :top_k
    """)

    try:
        result = await db.execute(
            similarity_sql,
            {
                "embedding": str(query_embedding),
                "top_k": top_k,
            },
        )
        rows = result.fetchall()
    except Exception as exc:
        logger.error("pgvector_search_failed", error=str(exc))
        raise

    # Step 3 — Guard: no results
    if not rows:
        logger.warning("rag_no_results", query=query)
        raise RAGRetrievalError(query)

    # Step 4 — Build context string
    context_parts: list[str] = []
    source_docs: list[SourceDocument] = []

    for row in rows:
        context_parts.append(
            f"[Source: {row.source} | Type: {row.doc_type}]\n{row.content}"
        )
        source_docs.append(
            SourceDocument(
                source=row.source,
                doc_type=row.doc_type,
                content_preview=row.content[:200] + "..." if len(row.content) > 200 else row.content,
                similarity_score=round(float(row.similarity), 4),
            )
        )

    context_text = "\n\n---\n\n".join(context_parts)

    # Step 5 — LLM synthesis
    logger.info("rag_llm_synthesis_started", chunks=len(rows))
    try:
        llm_response = await _chain.ainvoke(
            {"context": context_text, "question": query}
        )
        answer = llm_response.content
    except Exception as exc:
        logger.error("llm_synthesis_failed", error=str(exc))
        # Graceful degradation: return raw context instead of crashing
        answer = (
            "⚠️ LLM synthesis failed. Here are the raw retrieved documents:\n\n"
            + context_text[:1000]
        )

    logger.info("rag_query_completed", answer_length=len(answer))

    return RAGResponse(
        answer=answer,
        sources=source_docs,
        query=query,
        model_used=settings.llm_model,
        retrieval_count=len(rows),
    )
