"""OIDC integration with pharmacy unified auth system."""

from app.core.oidc.client import OIDCClient, get_oidc_client
from app.core.oidc.auth import oidc_login_or_create_staff

__all__ = ["OIDCClient", "get_oidc_client", "oidc_login_or_create_staff"]
