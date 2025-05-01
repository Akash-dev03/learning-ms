"""add is_archived field

Revision ID: add_is_archived_field
Revises: 6ff8c7730474
Create Date: 2024-03-19

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_is_archived_field'
down_revision: Union[str, None] = '6ff8c7730474'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add is_archived column with default value False
    op.add_column('books', sa.Column('is_archived', sa.Boolean(), nullable=False, server_default='false'))


def downgrade() -> None:
    # Remove is_archived column
    op.drop_column('books', 'is_archived') 