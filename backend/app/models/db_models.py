"""
SQLAlchemy ORM models mirroring the Supabase schema.
"""
import uuid
from datetime import date, datetime
from typing import Optional

from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    Float,
    ForeignKey,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    employees: Mapped[list["Employee"]] = relationship(
        "Employee", back_populates="department"
    )


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    department_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL")
    )
    role: Mapped[str] = mapped_column(String, nullable=False)
    seniority: Mapped[Optional[str]] = mapped_column(String)
    hire_date: Mapped[date] = mapped_column(Date, nullable=False)
    # 3D visualization coordinates (UMAP-reduced)
    pos_x: Mapped[Optional[float]] = mapped_column(Float)
    pos_y: Mapped[Optional[float]] = mapped_column(Float)
    pos_z: Mapped[Optional[float]] = mapped_column(Float)
    # Skill embedding vector
    embedding: Mapped[Optional[list[float]]] = mapped_column(Vector(1536))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    department: Mapped[Optional["Department"]] = relationship(
        "Department", back_populates="employees"
    )
    employee_skills: Mapped[list["EmployeeSkill"]] = relationship(
        "EmployeeSkill", back_populates="employee", cascade="all, delete-orphan"
    )


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    category: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    __table_args__ = (
        CheckConstraint(
            "category IN ('Technical', 'Soft', 'Leadership', 'Domain', 'Tool')",
            name="skills_category_check",
        ),
    )

    employee_skills: Mapped[list["EmployeeSkill"]] = relationship(
        "EmployeeSkill", back_populates="skill"
    )


class EmployeeSkill(Base):
    __tablename__ = "employee_skills"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False,
    )
    skill_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
    )
    proficiency_level: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    assessed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    assessed_by: Mapped[Optional[str]] = mapped_column(String)
    notes: Mapped[Optional[str]] = mapped_column(Text)

    __table_args__ = (
        UniqueConstraint("employee_id", "skill_id", name="uq_employee_skill"),
        CheckConstraint(
            "proficiency_level BETWEEN 1 AND 5", name="proficiency_level_check"
        ),
    )

    employee: Mapped["Employee"] = relationship("Employee", back_populates="employee_skills")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="employee_skills")


class KnowledgeBase(Base):
    __tablename__ = "knowledge_base"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String, nullable=False)
    doc_type: Mapped[str] = mapped_column(String, default="document")
    embedding: Mapped[list[float]] = mapped_column(Vector(1536), nullable=False)
    metadata_: Mapped[Optional[dict]] = mapped_column("metadata", JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
