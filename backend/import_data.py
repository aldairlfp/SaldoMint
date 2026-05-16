"""
Importa los backups JSON (backup_users.json, backup_transactions.json) a SQLite.
Uso:
    python import_data.py
"""

import json
import os
from datetime import date
from sqlmodel import Session, create_engine, SQLModel, text
from models import User, Transaction

DB_FILE = "./saldomint.db"
DATABASE_URL = f"sqlite:///{DB_FILE}"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SQLModel.metadata.create_all(engine)

with open("backup_users.json", encoding="utf-8") as f:
    users = json.load(f)

with open("backup_transactions.json", encoding="utf-8") as f:
    transactions = json.load(f)

with Session(engine) as session:
    # Vaciar tablas respetando el orden de FK
    session.exec(text('DELETE FROM "transaction"'))
    session.exec(text("DELETE FROM user"))
    session.commit()

    for u in users:
        session.add(User(**u))
    session.commit()

    for t in transactions:
        t["date"] = date.fromisoformat(t["date"])
        session.add(Transaction(**t))
    session.commit()

print(f"✓ {len(users)} usuarios importados")
print(f"✓ {len(transactions)} transacciones importadas")
print("  → saldomint.db listo")
