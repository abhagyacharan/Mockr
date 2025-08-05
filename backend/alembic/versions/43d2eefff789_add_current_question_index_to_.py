"""Add current_question_index to MockSession Model

Revision ID: 43d2eefff789
Revises: 6713bba7368d
Create Date: 2025-08-05 12:39:53.246832

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '43d2eefff789'
down_revision: Union[str, Sequence[str], None] = '6713bba7368d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('mock_sessions', sa.Column('current_question_index', sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column('mock_sessions', 'current_question_index')
