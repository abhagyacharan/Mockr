"""Add name field in User Tables

Revision ID: 6713bba7368d
Revises: 5551f14742e9
Create Date: 2025-08-05 11:10:31.046683

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6713bba7368d"
down_revision: Union[str, Sequence[str], None] = "5551f14742e9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("name", sa.String(length=255), nullable=False, server_default="Unknown"))


def downgrade() -> None:
    op.drop_column("users", "name")
