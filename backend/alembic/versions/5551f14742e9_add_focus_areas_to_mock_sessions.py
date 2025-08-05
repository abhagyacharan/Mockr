"""Add focus_areas to mock_sessions

Revision ID: 5551f14742e9
Revises: 09f92f708602
Create Date: 2025-08-05 08:45:55.483545

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5551f14742e9'
down_revision: Union[str, Sequence[str], None] = '09f92f708602'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        'mock_sessions',
        sa.Column('focus_areas', sa.ARRAY(sa.String()), nullable=True)
    )

def downgrade():
    op.drop_column('mock_sessions', 'focus_areas')
