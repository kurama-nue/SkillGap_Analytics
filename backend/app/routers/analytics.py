"""
Router: /api/v1/analytics — skill analytics and employee visualization data.
"""
import structlog
from fastapi import APIRouter, HTTPException, status

from app.database import DbSession
from app.models.schemas import DepartmentSpreadResponse, EmployeeNodesResponse
from app.services.analytics_service import get_department_spread, get_employee_nodes

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get(
    "/department-spread",
    response_model=DepartmentSpreadResponse,
    status_code=status.HTTP_200_OK,
    summary="Department Skill Spread",
    description=(
        "Returns aggregated skill metrics per department including coverage, "
        "average proficiency, top skills, and identified skill gaps."
    ),
)
async def department_spread_endpoint(db: DbSession) -> DepartmentSpreadResponse:
    """
    GET /api/v1/analytics/department-spread

    Returns per-department:
        - employee_count
        - skill_coverage (unique skills)
        - avg_proficiency
        - top_skills (top 5 by avg proficiency)
        - skill_gaps (skills with avg proficiency < 3)
    """
    logger.info("analytics_department_spread_requested")
    try:
        result = await get_department_spread(db=db)
        return result
    except Exception as exc:
        logger.error("analytics_department_spread_failed", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "analytics_error", "message": "Failed to compute department analytics."},
        ) from exc


@router.get(
    "/employee-nodes",
    response_model=EmployeeNodesResponse,
    status_code=status.HTTP_200_OK,
    summary="Employee 3D Node Data",
    description=(
        "Returns employee records with pre-computed UMAP 3D coordinates (pos_x, pos_y, pos_z) "
        "for the interactive skill galaxy visualization."
    ),
)
async def employee_nodes_endpoint(db: DbSession) -> EmployeeNodesResponse:
    """
    GET /api/v1/analytics/employee-nodes

    Returns all employees with:
        - pos_x, pos_y, pos_z: UMAP 3D coordinates
        - skill_count, avg_proficiency
        - has_skill_gap: True if avg_proficiency < 2.5
    """
    logger.info("analytics_employee_nodes_requested")
    try:
        result = await get_employee_nodes(db=db)
        return result
    except Exception as exc:
        logger.error("analytics_employee_nodes_failed", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "node_data_error", "message": "Failed to retrieve employee node data."},
        ) from exc
