"""add ai provider default model templates

Revision ID: 0026_ai_provider_default_models
Revises: 0025_rm_device_control_model
Create Date: 2026-03-11

"""

from typing import Sequence, Union
import uuid

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0026_ai_provider_default_models"
down_revision: Union[str, None] = "0025_rm_device_control_model"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "api_ai_provider_default_models",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("provider", sa.String(length=50), nullable=False),
        sa.Column("model_id", sa.String(length=100), nullable=False),
        sa.Column("model_name", sa.String(length=100), nullable=False),
        sa.Column("model_type", sa.String(length=20), nullable=False, server_default="chat"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "provider",
            "model_id",
            name="uq_ai_provider_default_models_provider_model_id",
        ),
    )
    op.create_index(
        "ix_api_ai_provider_default_models_provider",
        "api_ai_provider_default_models",
        ["provider"],
        unique=False,
    )

    defaults_table = sa.table(
        "api_ai_provider_default_models",
        sa.column("id", sa.UUID()),
        sa.column("provider", sa.String(length=50)),
        sa.column("model_id", sa.String(length=100)),
        sa.column("model_name", sa.String(length=100)),
        sa.column("model_type", sa.String(length=20)),
        sa.column("sort_order", sa.Integer()),
        sa.column("is_active", sa.Boolean()),
    )

    seed_rows = [
        # OpenAI
        ("openai", "gpt-4o-mini", "gpt-4o-mini", "chat", 10),
        ("openai", "gpt-4.1-mini", "gpt-4.1-mini", "chat", 20),
        ("openai", "text-embedding-3-small", "text-embedding-3-small", "embedding", 30),
        # Azure OpenAI
        ("azure_openai", "gpt-4o-mini", "gpt-4o-mini", "chat", 10),
        ("azure_openai", "gpt-4.1-mini", "gpt-4.1-mini", "chat", 20),
        ("azure_openai", "text-embedding-3-small", "text-embedding-3-small", "embedding", 30),
        # DashScope (Qwen)
        ("dashscope", "qwen3-plus", "qwen3-plus", "chat", 10),
        ("dashscope", "qwen3-max", "qwen3-max", "chat", 20),
        ("dashscope", "text-embedding-v4", "text-embedding-v4", "embedding", 30),
        # Anthropic
        ("anthropic", "claude-3-5-sonnet-latest", "claude-3-5-sonnet-latest", "chat", 10),
        ("anthropic", "claude-3-7-sonnet-latest", "claude-3-7-sonnet-latest", "chat", 20),
        # Moonshot
        ("moonshot", "moonshot-v1-8k", "moonshot-v1-8k", "chat", 10),
        ("moonshot", "moonshot-v1-32k", "moonshot-v1-32k", "chat", 20),
        # DeepSeek
        ("deepseek", "deepseek-chat", "deepseek-chat", "chat", 10),
        ("deepseek", "deepseek-reasoner", "deepseek-reasoner", "chat", 20),
        # Baichuan
        ("baichuan", "Baichuan4-Turbo", "Baichuan4-Turbo", "chat", 10),
        ("baichuan", "Baichuan-Text-Embedding", "Baichuan-Text-Embedding", "embedding", 20),
        # Ollama
        ("ollama", "llama3.1", "llama3.1", "chat", 10),
        ("ollama", "qwen2.5", "qwen2.5", "chat", 20),
        ("ollama", "nomic-embed-text", "nomic-embed-text", "embedding", 30),
        # OpenAI-compatible fallback (custom provider kind)
        ("openai_compatible", "gpt-4o-mini", "gpt-4o-mini", "chat", 10),
        ("openai_compatible", "gpt-4.1-mini", "gpt-4.1-mini", "chat", 20),
        ("openai_compatible", "text-embedding-3-small", "text-embedding-3-small", "embedding", 30),
    ]

    op.bulk_insert(
        defaults_table,
        [
            {
                "id": uuid.uuid4(),
                "provider": provider,
                "model_id": model_id,
                "model_name": model_name,
                "model_type": model_type,
                "sort_order": sort_order,
                "is_active": True,
            }
            for provider, model_id, model_name, model_type, sort_order in seed_rows
        ],
    )


def downgrade() -> None:
    op.drop_index("ix_api_ai_provider_default_models_provider", table_name="api_ai_provider_default_models")
    op.drop_table("api_ai_provider_default_models")
