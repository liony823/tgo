"""OIDC endpoints for pharmacy system SSO integration."""

import secrets
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.logging import get_logger
from app.core.oidc.client import get_oidc_client
from app.core.oidc.auth import oidc_login_or_create_staff

logger = get_logger("oidc_endpoint")

router = APIRouter()


class OIDCLoginResponse(BaseModel):
    """Response from OIDC login callback."""
    access_token: str
    token_type: str = "bearer"
    staff_id: str
    username: str
    role: str


@router.get("/login", summary="Initiate OIDC login with pharmacy system")
async def oidc_login_redirect(
    redirect_after: Optional[str] = Query(None, description="URL to redirect after login"),
):
    """
    Redirect user to the pharmacy system's OIDC authorization endpoint.
    The user will authenticate there and be redirected back to /oidc/callback.
    """
    client = get_oidc_client()
    if client is None:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="OIDC is not enabled",
        )
    state = secrets.token_urlsafe(32)
    nonce = secrets.token_urlsafe(16)
    authorize_url = client.get_authorize_url(state=state, nonce=nonce)
    return RedirectResponse(url=authorize_url)


@router.get("/callback", summary="OIDC callback from pharmacy system")
async def oidc_callback(
    code: str = Query(..., description="Authorization code from pharmacy system"),
    state: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Handle the OIDC callback:
    1. Exchange authorization code for tokens
    2. Verify the id_token using pharmacy JWKS
    3. Find or create a TGO Staff record
    4. Return a TGO access token

    This endpoint enables SSO: pharmacy users (doctors, pharmacists, admins)
    can seamlessly log into TGO for IM-based online consultation.
    """
    client = get_oidc_client()
    if client is None:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="OIDC is not enabled",
        )

    try:
        staff, tgo_token = await oidc_login_or_create_staff(client, code, db)
    except ValueError as e:
        logger.error(f"OIDC login failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"OIDC login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OIDC authentication failed",
        )

    return OIDCLoginResponse(
        access_token=tgo_token,
        staff_id=str(staff.id),
        username=staff.username,
        role=staff.role,
    )
