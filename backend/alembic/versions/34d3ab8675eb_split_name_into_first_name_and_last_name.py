"""split name into first_name and last_name

Revision ID: 34d3ab8675eb
Revises: 43d2eefff789
Create Date: 2025-08-11 15:00:42.855513

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '34d3ab8675eb'
down_revision: Union[str, Sequence[str], None] = '43d2eefff789'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add new columns
    op.add_column('users', sa.Column('first_name', sa.String(length=255), nullable=False, server_default=''))
    op.add_column('users', sa.Column('last_name', sa.String(length=255), nullable=False, server_default=''))

    # If you want to split existing "name" into two parts
    conn = op.get_bind()
    conn.execute(sa.text("""
        UPDATE users
        SET first_name = split_part(name, ' ', 1),
            last_name = split_part(name, ' ', 2)
    """))

    # Remove old column
    op.drop_column('users', 'name')


def downgrade():
    # Add back the old 'name' column
    op.add_column('users', sa.Column('name', sa.String(length=255), nullable=False, server_default=''))

    # Combine first_name and last_name into 'name'
    conn = op.get_bind()
    conn.execute(sa.text("""
        UPDATE users
        SET name = first_name || ' ' || last_name
    """))

    # Drop the new columns
    op.drop_column('users', 'first_name')
    op.drop_column('users', 'last_name')