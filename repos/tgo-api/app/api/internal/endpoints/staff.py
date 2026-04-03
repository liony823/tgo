"""Internal staff management endpoints for inter-service communication."""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.logging import get_logger
from app.core.security import get_password_hash
from app.models import Staff
from app.models.staff import StaffRole, StaffStatus
from app.services.wukongim_client import wukongim_client
from app.utils.const import CHANNEL_TYPE_PROJECT_STAFF
from app.utils.encoding import build_project_staff_channel_id

logger = get_logger("internal.staff")
router = APIRouter()


class InternalStaffCreateRequest(BaseModel):
    """Request schema for internal staff creation."""

    project_id: UUID = Field(..., description="Project ID for multi-tenant isolation")
    username: str = Field(..., min_length=1, max_length=50, description="Staff username")
    password: str = Field(..., min_length=1, max_length=128, description="Staff password (will be hashed)")
    name: str | None = Field(None, max_length=100, description="Staff real name")
    nickname: str | None = Field(None, max_length=100, description="Staff display name")
    avatar_url: str | None = Field(None, max_length=255, description="Staff avatar URL")
    description: str | None = Field(None, max_length=500, description="Staff description")


class InternalStaffCreateResponse(BaseModel):
    """Response schema for internal staff creation."""

    id: UUID
    project_id: UUID
    username: str
    name: str | None = None
    nickname: str | None = None
    avatar_url: str | None = None
    created: bool = Field(..., description="True if newly created, False if already existed")


@router.post("", response_model=InternalStaffCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_staff_internal(
    data: InternalStaffCreateRequest,
    db: Session = Depends(get_db),
) -> InternalStaffCreateResponse:
    """
    Create a staff member via internal service call (no authentication required).

    Idempotent: if a staff with the same username already exists, returns the
    existing record with created=False.
    """
    existing = db.query(Staff).filter(
        Staff.username == data.username,
        Staff.deleted_at.is_(None),
    ).first()

    if existing:
        logger.info(f"Internal staff create: username '{data.username}' already exists, returning existing")
        return InternalStaffCreateResponse(
            id=existing.id,
            project_id=existing.project_id,
            username=existing.username,
            name=existing.name,
            nickname=existing.nickname,
            avatar_url=existing.avatar_url,
            created=False,
        )

    staff = Staff(
        project_id=data.project_id,
        username=data.username,
        password_hash=get_password_hash(data.password),
        name=data.name,
        nickname=data.nickname,
        avatar_url=data.avatar_url,
        description=data.description,
        role=StaffRole.USER,
        status=StaffStatus.OFFLINE,
    )
    db.add(staff)
    db.flush()

    try:
        channel_id = build_project_staff_channel_id(data.project_id)
        staff_uid = f"{staff.id}-staff"
        await wukongim_client.add_channel_subscribers(
            channel_id=channel_id,
            channel_type=CHANNEL_TYPE_PROJECT_STAFF,
            subscribers=[staff_uid],
        )
    except Exception as e:
        logger.error(f"Failed to add internal staff {staff.id} to project channel: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add staff to project channel",
        )

    db.commit()
    db.refresh(staff)

    logger.info(f"Internal staff created: {staff.id} username={staff.username}")
    return InternalStaffCreateResponse(
        id=staff.id,
        project_id=staff.project_id,
        username=staff.username,
        name=staff.name,
        nickname=staff.nickname,
        avatar_url=staff.avatar_url,
        created=True,
    )


class StaffStatusRequest(BaseModel):
    """Request schema for batch staff status query."""

    staff_ids: List[UUID] = Field(..., description="List of staff IDs to query")


class StaffStatusItem(BaseModel):
    """Status info for a single staff member."""

    id: UUID
    status: str = Field(..., description="Staff status: online, offline, busy")


class StaffStatusResponse(BaseModel):
    """Response schema for batch staff status query."""

    items: List[StaffStatusItem] = Field(default_factory=list)


@router.post("/status", response_model=StaffStatusResponse)
async def get_staff_status_batch(
    data: StaffStatusRequest,
    db: Session = Depends(get_db),
) -> StaffStatusResponse:
    """
    Batch query staff online status by IDs (no authentication required).
    Returns status for each found staff member. Missing IDs are omitted.
    """
    if not data.staff_ids:
        return StaffStatusResponse(items=[])

    staff_list = db.query(Staff.id, Staff.status).filter(
        Staff.id.in_(data.staff_ids),
        Staff.deleted_at.is_(None),
    ).all()

    items = [
        StaffStatusItem(id=s.id, status=s.status)
        for s in staff_list
    ]
    return StaffStatusResponse(items=items)
