"""OIDC client for pharmacy system integration."""

import json
from typing import Any, Dict, Optional

import httpx
from jose import jwk, jwt
from jose.utils import base64url_decode

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("oidc")

_oidc_client: Optional["OIDCClient"] = None


class OIDCClient:
    """Client for communicating with the pharmacy system's OIDC Provider."""

    def __init__(self):
        self.issuer = settings.OIDC_ISSUER_URL.rstrip("/")
        self.client_id = settings.OIDC_CLIENT_ID
        self.client_secret = settings.OIDC_CLIENT_SECRET
        self.redirect_uri = settings.OIDC_REDIRECT_URI
        self.scopes = settings.OIDC_SCOPES
        self.jwks_url = settings.OIDC_JWKS_URL or f"{self.issuer}/.well-known/jwks.json"
        self._jwks_cache: Optional[Dict] = None
        self._discovery_cache: Optional[Dict] = None

    async def get_discovery(self) -> Dict[str, Any]:
        """Fetch OIDC discovery document."""
        if self._discovery_cache:
            return self._discovery_cache
        url = f"{self.issuer}/.well-known/openid-configuration"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=10)
            resp.raise_for_status()
            self._discovery_cache = resp.json()
            return self._discovery_cache

    async def get_jwks(self) -> Dict[str, Any]:
        """Fetch JWKS public keys."""
        if self._jwks_cache:
            return self._jwks_cache
        async with httpx.AsyncClient() as client:
            resp = await client.get(self.jwks_url, timeout=10)
            resp.raise_for_status()
            self._jwks_cache = resp.json()
            return self._jwks_cache

    def get_authorize_url(self, state: str, nonce: str = "") -> str:
        """Build the authorization redirect URL."""
        params = {
            "response_type": "code",
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": self.scopes,
            "state": state,
        }
        if nonce:
            params["nonce"] = nonce
        qs = "&".join(f"{k}={v}" for k, v in params.items())
        return f"{self.issuer}/oauth/authorize?{qs}"

    async def exchange_code(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for tokens."""
        discovery = await self.get_discovery()
        token_endpoint = discovery.get("token_endpoint", f"{self.issuer}/oauth/token")

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                token_endpoint,
                data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": self.redirect_uri,
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                },
                timeout=15,
            )
            resp.raise_for_status()
            return resp.json()

    async def get_userinfo(self, access_token: str) -> Dict[str, Any]:
        """Fetch user info from OIDC userinfo endpoint."""
        discovery = await self.get_discovery()
        userinfo_endpoint = discovery.get(
            "userinfo_endpoint", f"{self.issuer}/oauth/userinfo"
        )

        async with httpx.AsyncClient() as client:
            resp = await client.get(
                userinfo_endpoint,
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=10,
            )
            resp.raise_for_status()
            return resp.json()

    async def verify_id_token(self, id_token: str) -> Dict[str, Any]:
        """Verify and decode an ID token using JWKS."""
        jwks_data = await self.get_jwks()
        keys = jwks_data.get("keys", [])

        unverified_header = jwt.get_unverified_header(id_token)
        kid = unverified_header.get("kid")

        rsa_key = None
        for key_data in keys:
            if key_data.get("kid") == kid:
                rsa_key = key_data
                break

        if not rsa_key:
            raise ValueError(f"No matching key found for kid={kid}")

        payload = jwt.decode(
            id_token,
            rsa_key,
            algorithms=["RS256"],
            audience=self.client_id,
            issuer=self.issuer,
        )
        return payload

    def invalidate_caches(self):
        """Clear cached discovery and JWKS data."""
        self._discovery_cache = None
        self._jwks_cache = None


def get_oidc_client() -> Optional[OIDCClient]:
    """Get or create the global OIDC client (None if OIDC is disabled)."""
    global _oidc_client
    if not settings.OIDC_ENABLED:
        return None
    if _oidc_client is None:
        _oidc_client = OIDCClient()
    return _oidc_client
