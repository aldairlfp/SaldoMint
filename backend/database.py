import os
from typing import Annotated

from fastapi import Depends
from sqlmodel import SQLModel, Session, create_engine

_db_path = os.environ.get("DB_PATH", "./saldomint.db")
DATABASE_URL = f"sqlite:///{_db_path}"

engine = create_engine(
    DATABASE_URL, echo=False, connect_args={"check_same_thread": False}
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
