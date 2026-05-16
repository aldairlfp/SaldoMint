"""Remove User from transactions

Revision ID: 3ea0ccaa39f4
Revises: 64724eafef48
Create Date: 2026-04-24 22:53:38.882261

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3ea0ccaa39f4"
down_revision: Union[str, Sequence[str], None] = "64724eafef48"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("transaction") as batch_op:
        batch_op.drop_column("user_id")


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("transaction") as batch_op:
        batch_op.add_column(sa.Column("user_id", sa.INTEGER(), nullable=False))
        batch_op.create_foreign_key(None, "user", ["user_id"], ["id"])
