"""
Structured logging and request ID middleware setup.
"""
import logging
import uuid

import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


def configure_logging(level: str = "INFO") -> None:
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.dev.ConsoleRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(
            logging.getLevelName(level)
        ),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
    )


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Injects a unique request_id into every log entry for that request."""

    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            method=request.method,
            path=request.url.path,
        )
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response
