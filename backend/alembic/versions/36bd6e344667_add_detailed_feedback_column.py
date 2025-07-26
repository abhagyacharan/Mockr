"""add detailed_feedback column

Revision ID: 36bd6e344667
Revises: 59688859697e
Create Date: 2025-07-26 02:51:46.403901

"""
from typing import Sequence, Union
from sqlalchemy.dialects import postgresql
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '36bd6e344667'
down_revision: Union[str, Sequence[str], None] = '59688859697e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add the detailed_feedback column
    op.add_column('user_responses', 
        sa.Column('detailed_feedback', 
                 postgresql.JSONB(astext_type=sa.Text()), 
                 nullable=True)
    )

def downgrade():
    # Remove the detailed_feedback column
    op.drop_column('user_responses', 'detailed_feedback')