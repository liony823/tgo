"""OIDC-based staff authentication and auto-provisioning."""

import json
from typing import Dict, Optional, Tuple
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging import get_logger
from app.core.security import get_password_hash, create_access_token
from app.core.oidc.client import OIDCClient
from app.models import Staff, Project

logger = get_logger("oidc_auth")


def _get_role_mapping() -> Dict[str, str]:
    """Parse the pharmacy role → TGO staff role mapping from config."""
    try:
        return json.loads(settings.OIDC_STAFF_ROLE_MAPPING)
    except (json.JSONDecodeError, TypeError):
        return {}


def _map_pharmacy_role_to_tgo(pharmacy_role: str) -> str:
    """Map a pharmacy system role code to a TGO staff role."""
    mapping = _get_role_mapping()
    return mapping.get(pharmacy_role, "user")


async def oidc_login_or_create_staff(
    oidc_client: OIDCClient,
    code: str,
    db: Session,
) -> Tuple[Staff, str]:
    """
    Handle the full OIDC callback flow:
    1. Exchange code for tokens
    2. Verify id_token / fetch userinfo
    3. Find or create TGO Staff
    4. Return Staff + TGO JWT

    Returns:
        Tuple of (Staff, access_token)
    """
    # Exchange authorization code for tokens
    token_data = await oidc_client.exchange_code(code)
    access_token_pharmacy = token_data.get("access_token", "")
    id_token = token_data.get("id_token", "")

    # Get user info (prefer id_token, fallback to userinfo endpoint)
    userinfo = {}
    if id_token:
        try:
            userinfo = await oidc_client.verify_id_token(id_token)
        except Exception as e:
            logger.warning(f"Failed to verify id_token, falling back to userinfo endpoint: {e}")

    if not userinfo and access_token_pharmacy:
        userinfo = await oidc_client.get_userinfo(access_token_pharmacy)

    if not userinfo or "sub" not in userinfo:
        raise ValueError("Failed to get user info from pharmacy OIDC")

    pharmacy_uuid = userinfo["sub"]
    pharmacy_username = userinfo.get("nickname") or userinfo.get("name") or pharmacy_uuid
    pharmacy_role = userinfo.get("role", "patient")
    pharmacy_user_type = userinfo.get("user_type", "patient")

    # Construct a stable username for TGO
    tgo_username = f"pharmacy_{pharmacy_uuid[:8]}"

    # Find existing staff by username
    staff = db.query(Staff).filter(
        Staff.username == tgo_username,
        Staff.deleted_at.is_(None),
    ).first()

    # Determine project
    project_id = settings.OIDC_DEFAULT_PROJECT_ID
    if not project_id:
        project = db.query(Project).filter(Project.deleted_at.is_(None)).first()
        if project:
            project_id = str(project.id)

    if not project_id:
        raise ValueError("No project available for OIDC staff provisioning")

    tgo_role = _map_pharmacy_role_to_tgo(pharmacy_role)

    if staff is None:
        # Auto-create staff
        staff = Staff(
            project_id=UUID(project_id),
            username=tgo_username,
            password_hash=get_password_hash(f"oidc_{pharmacy_uuid}"),
            name=userinfo.get("name") or pharmacy_username,
            nickname=userinfo.get("nickname") or pharmacy_username,
            avatar_url=userinfo.get("picture"),
            description=f"来自药房系统 ({pharmacy_user_type}:{pharmacy_role})",
            role=tgo_role,
            status="offline",
            is_active=True,
        )
        db.add(staff)
        db.commit()
        db.refresh(staff)
        logger.info(f"Auto-created TGO staff for pharmacy user: {pharmacy_uuid} -> {tgo_username}")
    else:
        # Update staff info from pharmacy
        staff.name = userinfo.get("name") or staff.name
        staff.nickname = userinfo.get("nickname") or staff.nickname
        if userinfo.get("picture"):
            staff.avatar_url = userinfo["picture"]
        staff.role = tgo_role
        db.commit()
        db.refresh(staff)
        logger.info(f"Updated TGO staff from pharmacy OIDC: {tgo_username}")

    # Generate TGO JWT
    from datetime import timedelta
    tgo_access_token = create_access_token(
        subject=staff.username,
        project_id=staff.project_id,
        role=staff.role,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return staff, tgo_access_token
