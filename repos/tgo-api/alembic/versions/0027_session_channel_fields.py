"""add channel_id and channel_type to visitor sessions

Revision ID: 0027_session_channel_fields
Revises: 0026_ai_provider_default_models
Create Date: 2026-04-03

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0027_session_channel_fields"
down_revision: Union[str, None] = "0026_ai_provider_default_models"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "api_visitor_sessions",
        sa.Column("channel_id", sa.String(255), nullable=True, comment="WuKongIM channel ID bound to this session"),
    )
    op.add_column(
        "api_visitor_sessions",
        sa.Column("channel_type", sa.Integer(), nullable=False, server_default="251", comment="WuKongIM channel type (251=customer service)"),
    )
    op.create_index("ix_api_visitor_sessions_channel_id", "api_visitor_sessions", ["channel_id"])


def downgrade() -> None:
    op.drop_index("ix_api_visitor_sessions_channel_id", table_name="api_visitor_sessions")
    op.drop_column("api_visitor_sessions", "channel_type")
    op.drop_column("api_visitor_sessions", "channel_id")
