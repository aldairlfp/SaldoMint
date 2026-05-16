from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlmodel import select

from models import (
    Transaction,
    TransactionCreate,
    TransactionFilterModel,
    TransactionRead,
    User,
)

from database import SessionDep
from security import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionRead])
def get_transactions(
    filter_query: Annotated[
        TransactionFilterModel,
        Depends(),
    ],
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    query = select(Transaction).where(Transaction.user_id == current_user.id)
    if filter_query.category is not None:
        query = query.where(Transaction.category == filter_query.category)
    if filter_query.type is not None:
        query = query.where(Transaction.type == filter_query.type)
    if filter_query.currency is not None:
        query = query.where(Transaction.currency == filter_query.currency)
    if filter_query.start_date is not None:
        query = query.where(Transaction.date >= filter_query.start_date)
    if filter_query.end_date is not None:
        query = query.where(Transaction.date <= filter_query.end_date)
    transactions = session.exec(query.offset(offset).limit(limit)).all()
    return transactions


@router.get("/{transaction_id}", response_model=TransactionRead)
def get_transaction(
    transaction_id: Annotated[
        int, Path(description="The ID of the transaction to retrieve", ge=1)
    ],
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
):
    transaction = session.exec(
        select(Transaction).where(
            Transaction.id == transaction_id, Transaction.user_id == current_user.id
        )
    ).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.post("", response_model=TransactionRead)
def create_transaction(
    transaction: TransactionCreate,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
):
    db_transaction = Transaction.model_validate(
        transaction, update={"user_id": current_user.id}
    )
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction


@router.put("/{transaction_id}", response_model=TransactionRead)
def update_transaction(
    transaction_id: Annotated[
        int, Path(description="The ID of the transaction to update", ge=1)
    ],
    transaction: TransactionCreate,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
):
    transaction_db = session.exec(
        select(Transaction).where(
            Transaction.id == transaction_id, Transaction.user_id == current_user.id
        )
    ).first()
    if not transaction_db:
        raise HTTPException(status_code=404, detail="Transaction not found")
    transaction_data = transaction.model_dump(exclude_unset=True)
    transaction_db.sqlmodel_update(transaction_data)
    session.add(transaction_db)
    session.commit()
    session.refresh(transaction_db)
    return transaction_db


@router.delete("/{transaction_id}", response_model=dict[str, str])
def delete_transaction(
    transaction_id: Annotated[
        int, Path(description="The ID of the transaction to delete", ge=1)
    ],
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
):
    transaction_db = session.exec(
        select(Transaction).where(
            Transaction.id == transaction_id, Transaction.user_id == current_user.id
        )
    ).first()
    if not transaction_db:
        raise HTTPException(status_code=404, detail="Transaction not found")
    session.delete(transaction_db)
    session.commit()
    return {"message": "Transaction deleted"}
