"""Visitor Session schemas."""

from datetime import datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID

from pydantic import Field

from app.schemas.base import BaseSchema


class SessionStatus(str, Enum):
    """Session status enumeration."""
    
    OPEN = "open"
    CLOSED = "closed"


class VisitorSessionBase(BaseSchema):
    """Base schema for visitor session."""
    
    visitor_id: UUID = Field(..., description="Visitor ID")
    staff_id: Optional[UUID] = Field(None, description="Staff member handling this session")
    platform_id: Optional[UUID] = Field(None, description="Platform where session originated")
    status: SessionStatus = Field(
        default=SessionStatus.OPEN,
        description="Session status: open or closed"
    )


class VisitorSessionCreate(VisitorSessionBase):
    """Schema for creating a visitor session."""
    pass


class VisitorSessionUpdate(BaseSchema):
    """Schema for updating a visitor session."""
    
    staff_id: Optional[UUID] = Field(None, description="Updated staff member")
    status: Optional[SessionStatus] = Field(None, description="Updated session status")


class VisitorSessionResponse(BaseSchema):
    """Schema for visitor session response."""
    
    id: UUID = Field(..., description="Session ID")
    project_id: UUID = Field(..., description="Project ID")
    visitor_id: UUID = Field(..., description="Visitor ID")
    staff_id: Optional[UUID] = Field(None, description="Staff member ID")
    platform_id: Optional[UUID] = Field(None, description="Platform ID")
    channel_id: Optional[str] = Field(None, description="WuKongIM channel ID for this session")
    channel_type: int = Field(default=251, description="WuKongIM channel type")
    status: str = Field(..., description="Session status")
    closed_at: Optional[datetime] = Field(None, description="When session was closed")
    duration_seconds: Optional[int] = Field(None, description="Session duration in seconds")
    message_count: int = Field(default=0, description="Total message count")
    visitor_message_count: int = Field(default=0, description="Visitor message count")
    staff_message_count: int = Field(default=0, description="Staff message count")
    ai_message_count: int = Field(default=0, description="AI message count")
    last_message_at: Optional[datetime] = Field(None, description="Last message timestamp")
    last_message_seq: Optional[int] = Field(None, description="Last message sequence number")
    created_at: datetime = Field(..., description="Session start timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")


class VisitorSessionDetailResponse(VisitorSessionResponse):
    """Detailed response with related data."""
    
    visitor_name: Optional[str] = Field(None, description="Visitor display name")
    staff_name: Optional[str] = Field(None, description="Staff member name")
    platform_name: Optional[str] = Field(None, description="Platform name")


class VisitorSessionListParams(BaseSchema):
    """Parameters for listing visitor sessions."""
    
    visitor_id: Optional[UUID] = Field(None, description="Filter by visitor ID")
    staff_id: Optional[UUID] = Field(None, description="Filter by staff ID")
    platform_id: Optional[UUID] = Field(None, description="Filter by platform ID")
    status: Optional[SessionStatus] = Field(None, description="Filter by status")
    limit: int = Field(default=20, ge=1, le=100, description="Page size")
    offset: int = Field(default=0, ge=0, description="Page offset")


# ---------------------------------------------------------------------------
# Consultation (online-diagnosis) schemas
# ---------------------------------------------------------------------------

class ConsultationCreateRequest(BaseSchema):
    """Request to create a 1-on-1 consultation session between visitor and staff."""

    platform_api_key: str = Field(..., description="Platform API key for authentication")
    visitor_id: UUID = Field(..., description="Visitor (patient) ID")
    staff_id: UUID = Field(..., description="Staff (doctor) ID")


class ConsultationCreateResponse(BaseSchema):
    """Response after creating a consultation session."""

    session_id: UUID = Field(..., description="Created session ID")
    channel_id: str = Field(..., description="WuKongIM channel ID for this consultation")
    channel_type: int = Field(default=251, description="WuKongIM channel type")
    staff_id: UUID = Field(..., description="Assigned staff (doctor) ID")
    staff_name: Optional[str] = Field(None, description="Staff display name")
    staff_avatar: Optional[str] = Field(None, description="Staff avatar URL")
    status: str = Field(default="open", description="Session status")
    created_at: datetime = Field(..., description="Session creation timestamp")


class ConsultationSessionInfo(BaseSchema):
    """Summary info for a single consultation session in a list response."""

    session_id: UUID = Field(..., description="Session ID")
    channel_id: str = Field(..., description="WuKongIM channel ID")
    channel_type: int = Field(default=251, description="WuKongIM channel type")
    staff_id: Optional[UUID] = Field(None, description="Staff (doctor) ID")
    staff_name: Optional[str] = Field(None, description="Staff display name")
    staff_avatar: Optional[str] = Field(None, description="Staff avatar URL")
    status: str = Field(..., description="Session status (open / closed)")
    last_message_at: Optional[datetime] = Field(None, description="Last message timestamp")
    message_count: int = Field(default=0, description="Total message count")
    created_at: datetime = Field(..., description="Session creation timestamp")


class ConsultationListResponse(BaseSchema):
    """Response listing consultation sessions for a visitor."""

    data: List[ConsultationSessionInfo] = Field(default_factory=list, description="Consultation sessions")
