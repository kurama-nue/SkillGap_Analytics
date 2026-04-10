"""
Analytics service: department skill spread aggregation + employee nodes for 3D visualization.
"""
from datetime import datetime

import structlog
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.db_models import Department, Employee, EmployeeSkill, Skill
from app.models.schemas import (
    DepartmentSpread,
    DepartmentSpreadResponse,
    EmployeeNodeResponse,
    EmployeeNodesResponse,
    SkillMetric,
)

logger = structlog.get_logger(__name__)


async def get_department_spread(db: AsyncSession) -> DepartmentSpreadResponse:
    """
    Aggregate skill metrics per department.
    Returns per-department skill coverage, avg proficiency, top skills, and skill gaps.
    """
    # Fetch all departments with employees
    dept_query = select(Department).order_by(Department.name)
    dept_result = await db.execute(dept_query)
    departments = dept_result.scalars().all()

    if not departments:
        return DepartmentSpreadResponse(
            departments=[],
            total_employees=0,
            total_skills=0,
            generated_at=datetime.utcnow(),
        )

    all_spreads: list[DepartmentSpread] = []
    total_employees = 0

    for dept in departments:
        # Per-department skill aggregation
        skill_agg_sql = text("""
            SELECT
                s.name        AS skill_name,
                s.category    AS category,
                COUNT(es.id)  AS employee_count,
                AVG(es.proficiency_level)::FLOAT  AS avg_proficiency,
                MIN(es.proficiency_level)          AS min_proficiency,
                MAX(es.proficiency_level)          AS max_proficiency
            FROM employees e
            JOIN employee_skills es ON es.employee_id = e.id
            JOIN skills s           ON s.id = es.skill_id
            WHERE e.department_id = :dept_id
            GROUP BY s.name, s.category
            ORDER BY avg_proficiency DESC
        """)

        skill_result = await db.execute(skill_agg_sql, {"dept_id": str(dept.id)})
        skill_rows = skill_result.fetchall()

        # Employee count for this dept
        emp_count_result = await db.execute(
            select(func.count(Employee.id)).where(Employee.department_id == dept.id)
        )
        emp_count: int = emp_count_result.scalar_one() or 0
        total_employees += emp_count

        # Build skill metrics
        skill_metrics: list[SkillMetric] = []
        skill_gaps: list[str] = []
        total_proficiency = 0.0

        for row in skill_rows:
            metric = SkillMetric(
                skill_name=row.skill_name,
                category=row.category,
                employee_count=row.employee_count,
                avg_proficiency=round(row.avg_proficiency, 2),
                min_proficiency=row.min_proficiency,
                max_proficiency=row.max_proficiency,
            )
            skill_metrics.append(metric)
            total_proficiency += row.avg_proficiency
            if row.avg_proficiency < 3.0:
                skill_gaps.append(row.skill_name)

        dept_avg = (
            round(total_proficiency / len(skill_metrics), 2) if skill_metrics else 0.0
        )

        all_spreads.append(
            DepartmentSpread(
                department_name=dept.name,
                employee_count=emp_count,
                skill_coverage=len(skill_metrics),
                avg_proficiency=dept_avg,
                top_skills=skill_metrics[:5],  # top 5 by avg proficiency
                skill_gaps=skill_gaps,
            )
        )

    # Total unique skills in the company
    total_skills_result = await db.execute(select(func.count(Skill.id)))
    total_skills: int = total_skills_result.scalar_one() or 0

    return DepartmentSpreadResponse(
        departments=all_spreads,
        total_employees=total_employees,
        total_skills=total_skills,
        generated_at=datetime.utcnow(),
    )


async def get_employee_nodes(db: AsyncSession) -> EmployeeNodesResponse:
    """
    Return employee data shaped for the 3D scatter plot.
    Includes pre-computed (pos_x, pos_y, pos_z) UMAP coordinates.
    """
    node_sql = text("""
        SELECT
            e.id,
            e.full_name,
            e.email,
            d.name           AS department,
            e.role,
            e.seniority,
            e.pos_x,
            e.pos_y,
            e.pos_z,
            COUNT(es.id)     AS skill_count,
            COALESCE(AVG(es.proficiency_level), 0)::FLOAT AS avg_proficiency
        FROM employees e
        LEFT JOIN departments d     ON d.id = e.department_id
        LEFT JOIN employee_skills es ON es.employee_id = e.id
        GROUP BY e.id, e.full_name, e.email, d.name, e.role, e.seniority, e.pos_x, e.pos_y, e.pos_z
        ORDER BY e.full_name
    """)

    result = await db.execute(node_sql)
    rows = result.fetchall()

    nodes: list[EmployeeNodeResponse] = []
    for row in rows:
        nodes.append(
            EmployeeNodeResponse(
                id=str(row.id),
                full_name=row.full_name,
                email=row.email,
                department=row.department,
                role=row.role,
                seniority=row.seniority,
                pos_x=row.pos_x,
                pos_y=row.pos_y,
                pos_z=row.pos_z,
                skill_count=row.skill_count,
                avg_proficiency=round(row.avg_proficiency, 2),
                has_skill_gap=row.avg_proficiency < 2.5,
            )
        )

    return EmployeeNodesResponse(nodes=nodes, total=len(nodes))
