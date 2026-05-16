"""
Exporta todos los datos de la base de datos a archivos JSON.
Uso:
    DATABASE_URL=postgresql://... python export_data.py
o pon la URL directamente abajo en RAILWAY_URL.
"""

import json
import os
import sys
from datetime import date

from sqlmodel import Session, select, create_engine

from models import User, Transaction

RAILWAY_URL = (
    os.environ.get("DATABASE_URL")
    or input("Pega aquí tu DATABASE_URL de Railway: ").strip()
)
RAILWAY_URL = RAILWAY_URL.replace("postgres://", "postgresql+psycopg2://", 1)
if "postgresql://" in RAILWAY_URL and "+psycopg2" not in RAILWAY_URL:
    RAILWAY_URL = RAILWAY_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

engine = create_engine(RAILWAY_URL, echo=False)


def serialize(obj):
    if isinstance(obj, date):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")


with Session(engine) as session:
    users = session.exec(select(User)).all()
    transactions = session.exec(select(Transaction)).all()

users_data = [u.model_dump() for u in users]
transactions_data = [t.model_dump() for t in transactions]

with open("backup_users.json", "w", encoding="utf-8") as f:
    json.dump(users_data, f, indent=2, default=serialize)

with open("backup_transactions.json", "w", encoding="utf-8") as f:
    json.dump(transactions_data, f, indent=2, default=serialize)

print(f"✓ {len(users_data)} usuarios  →  backup_users.json")
print(f"✓ {len(transactions_data)} transacciones  →  backup_transactions.json")
