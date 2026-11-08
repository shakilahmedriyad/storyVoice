"""init

Revision ID: 662eb68e503c
Revises:
Create Date: 2026-11-08 05:12:26.823608

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "662eb68e503c"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("chapters", sa.Column("chapter_index", sa.INTEGER(), nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("chapters", "chapter_index")
