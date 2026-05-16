from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import select

from database import SessionDep
from models import (
    Transaction,
    TransactionByCategoryResponse,
    TransactionFilterModel,
    TransactionSummaryResponse,
    User,
)
from security import get_current_user

router = APIRouter(prefix="/stats", tags=["stats"])


def _apply_filters(query, filter_query: TransactionFilterModel):
    if filter_query.currency is not None:
        query = query.where(Transaction.currency == filter_query.currency)
    if filter_query.category is not None:
        query = query.where(Transaction.category == filter_query.category)
    if filter_query.type is not None:
        query = query.where(Transaction.type == filter_query.type)
    if filter_query.start_date is not None:
        query = query.where(Transaction.date >= filter_query.start_date)
    if filter_query.end_date is not None:
        query = query.where(Transaction.date <= filter_query.end_date)
    return query


@router.get("/summary", response_model=dict[str, TransactionSummaryResponse])
def get_summary(
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    filter_query: Annotated[TransactionFilterModel, Depends()],
):
    query = select(Transaction).where(Transaction.user_id == current_user.id)
    query = _apply_filters(query, filter_query)
    transactions = session.exec(query).all()
    summary: dict[str, dict[str, float]] = {}
    for t in transactions:
        currency = t.currency
        if currency not in summary:
            summary[currency] = {"income": 0.0, "expense": 0.0}
        if t.type == "income":
            summary[currency]["income"] += t.amount
        else:
            summary[currency]["expense"] += t.amount
    return {
        currency: TransactionSummaryResponse(
            total_income=round(stats["income"], 2),
            total_expense=round(stats["expense"], 2),
            net_balance=round(stats["income"] - stats["expense"], 2),
        )
        for currency, stats in summary.items()
    }


@router.get("/by-category", response_model=dict[str, TransactionByCategoryResponse])
def get_stats_by_category(
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    filter_query: Annotated[TransactionFilterModel, Depends()],
):
    query = select(Transaction).where(Transaction.user_id == current_user.id)
    query = _apply_filters(query, filter_query)
    transactions = session.exec(query).all()
    category_stats: dict[str, dict[str, float]] = {}
    for t in transactions:
        category = t.category
        if category not in category_stats:
            category_stats[category] = {"income": 0.0, "expense": 0.0}
        if t.type == "income":
            category_stats[category]["income"] += t.amount
        else:
            category_stats[category]["expense"] += t.amount
    return {
        category: TransactionByCategoryResponse(
            total_income=round(stats["income"], 2),
            total_expense=round(stats["expense"], 2),
        )
        for category, stats in category_stats.items()
    }
