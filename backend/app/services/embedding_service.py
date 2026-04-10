"""
OpenAI embedding wrapper with retry logic and error handling.
"""
from typing import Optional

import structlog
from openai import AsyncOpenAI, APIConnectionError, APIStatusError, RateLimitError
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.config import get_settings
from app.utils.exceptions import EmbeddingServiceError

logger = structlog.get_logger(__name__)
settings = get_settings()

_client: Optional[AsyncOpenAI] = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


@retry(
    retry=retry_if_exception_type((APIConnectionError, RateLimitError)),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
)
async def embed_text(text: str) -> list[float]:
    """
    Embed a single string using OpenAI text-embedding-3-small.
    Returns a 1536-dimensional float vector.

    Raises:
        EmbeddingServiceError: on API failures after retries.
    """
    if not text or not text.strip():
        raise EmbeddingServiceError("Cannot embed empty text.")

    client = _get_client()
    try:
        response = await client.embeddings.create(
            model=settings.embedding_model,
            input=text.strip(),
            dimensions=settings.embedding_dimensions,
        )
        vector = response.data[0].embedding
        logger.debug("embedding_created", model=settings.embedding_model, dims=len(vector))
        return vector

    except APIStatusError as exc:
        raise EmbeddingServiceError(
            f"OpenAI API error {exc.status_code}: {exc.message}"
        ) from exc
    except APIConnectionError as exc:
        raise EmbeddingServiceError(
            f"Cannot reach OpenAI API: {exc}"
        ) from exc


async def embed_batch(texts: list[str]) -> list[list[float]]:
    """
    Embed multiple strings in a single API call (max 2048 inputs).

    Raises:
        EmbeddingServiceError: on API failures.
    """
    if not texts:
        return []

    client = _get_client()
    try:
        response = await client.embeddings.create(
            model=settings.embedding_model,
            input=texts,
            dimensions=settings.embedding_dimensions,
        )
        # Response data is ordered the same as input
        return [item.embedding for item in response.data]

    except (APIStatusError, APIConnectionError) as exc:
        raise EmbeddingServiceError(str(exc)) from exc
