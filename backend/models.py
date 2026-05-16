import datetime
from typing import Literal

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    username: str = Field(..., min_length=3, max_length=50)


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str


class UserCreate(UserBase):
    password: str


class Token(SQLModel):
    access_token: str
    token_type: str


class TransactionBase(SQLModel):
    type: str
    amount: float = Field(
        ..., gt=0, description="The amount of the transaction, must be greater than 0"
    )
    category: str
    currency: str = "CUP"
    description: str | None = None
    date: datetime.date


class Transaction(TransactionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")


class TransactionCreate(TransactionBase):
    type: Literal["income", "expense"]
    category: Literal[
        "salary", "food", "entertainment", "transportation", "utilities", "other"
    ]
    currency: Literal["CUP", "USD", "EUR"] = "CUP"


class TransactionRead(TransactionBase):
    id: int


class TransactionByCategoryResponse(SQLModel):
    total_income: float
    total_expense: float


class TransactionSummaryResponse(SQLModel):
    total_income: float
    total_expense: float
    net_balance: float


class TransactionFilterModel(SQLModel):
    category: str | None = None
    type: Literal["income", "expense"] | None = None
    currency: Literal["CUP", "USD", "EUR"] | None = None
    start_date: datetime.date | None = None
    end_date: datetime.date | None = None
