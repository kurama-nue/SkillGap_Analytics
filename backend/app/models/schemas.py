"""
Pydantic v2 request/response schemas for all API endpoints.
"""
import uuid
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


# ── Engine / RAG ──────────────────────────────────────────────────────────────

class QueryRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        examples=["Which engineers are missing Kubernetes skills?"],
    )
    top_k: int = Field(default=5, ge=1, le=20)

    @field_validator("query")
    @classmethod
    def strip_query(cls, v: str) -> str:
        return v.strip()


class SourceDocument(BaseModel):
    source: str
    doc_type: str
    content_preview: str  # first 200 chars
    similarity_score: float


class RAGResponse(BaseModel):
    answer: str
    sources: list[SourceDocument]
    query: str
    model_used: str
    retrieval_count: int


# ── Analytics ─────────────────────────────────────────────────────────────────

class SkillMetric(BaseModel):
    skill_name: str
    category: str
    employee_count: int
    avg_proficiency: float
    min_proficiency: int
    max_proficiency: int


class DepartmentSpread(BaseModel):
    department_name: str
    employee_count: int
    skill_coverage: int  # unique skills in dept
    avg_proficiency: float
    top_skills: list[SkillMetric]
    skill_gaps: list[str]  # skills with avg < 3


class DepartmentSpreadResponse(BaseModel):
    departments: list[DepartmentSpread]
    total_employees: int
    total_skills: int
    generated_at: datetime


# ── Employee nodes for 3D visualization ───────────────────────────────────────

class EmployeeNodeResponse(BaseModel):
    id: str
    full_name: str
    email: str
    department: Optional[str]
    role: str
    seniority: Optional[str]
    pos_x: Optional[float]
    pos_y: Optional[float]
    pos_z: Optional[float]
    skill_count: int
    avg_proficiency: float
    has_skill_gap: bool  # True if avg proficiency < 2.5


class EmployeeNodesResponse(BaseModel):
    nodes: list[EmployeeNodeResponse]
    total: int


# ── Shared ────────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    version: str
    db_connected: bool
