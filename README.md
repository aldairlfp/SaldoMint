# SaldoMint 💰

A personal finance tracker that lets you record and analyze your income and expenses. Available as a **web app** and **desktop app** (Tauri).

## Features

- **Transaction management** — create, edit, and delete income/expense entries
- **Multi-currency support** — CUP, USD, and EUR tracked independently
- **Statistics** — summary cards and monthly charts per currency
- **Authentication** — JWT-based registration and login
- **Rate limiting** — 100 requests/minute per IP

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLModel, SQLite, Alembic |
| Frontend | React 19, Vite, Tailwind CSS, Recharts |
| Desktop | Tauri (bundles frontend + backend binary) |

## Project Structure

```
saldomint/
├── backend/          # FastAPI REST API
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── security.py
│   ├── routers/
│   │   ├── auth.py          # /auth/register, /auth/token
│   │   ├── transactions.py  # /transactions CRUD
│   │   └── stats.py         # /stats/summary
│   └── alembic/             # Database migrations
├── frontend/         # React SPA
│   └── src/
│       ├── Pages/           # TransactionPage, StatsPage, LoginPage
│       └── Components/      # Reusable UI components
└── desktop/          # Tauri desktop wrapper
    └── src-tauri/
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Rust (for desktop build only)

### Backend

```bash
cd backend
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the API server
python main.py
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

The database path can be configured with the `DB_PATH` environment variable (defaults to `./saldomint.db`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. The dev server proxies `/api/*` requests to the backend at `http://localhost:8000`.

### Desktop (Tauri)

Make sure the backend binary is placed in `desktop/src-tauri/binaries/` before building.

```bash
cd desktop
npm install
npm run tauri dev   # development
npm run tauri build # production installer
```

## API Reference

All endpoints (except auth) require a `Bearer` token in the `Authorization` header.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user, returns JWT |
| `POST` | `/auth/token` | Login, returns JWT |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/transactions` | List transactions |
| `GET` | `/transactions/{id}` | Get a single transaction |
| `POST` | `/transactions` | Create a transaction |
| `PUT` | `/transactions/{id}` | Update a transaction |
| `DELETE` | `/transactions/{id}` | Delete a transaction |

### Stats

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stats/summary` | Total income, expense, and net balance grouped by currency |

### Transaction fields

| Field | Values |
|---|---|
| `type` | `income`, `expense` |
| `category` | `salary`, `food`, `entertainment`, `transportation`, `utilities`, `other` |
| `currency` | `CUP`, `USD`, `EUR` |
| `amount` | Positive number |
| `date` | `YYYY-MM-DD` |
| `description` | Optional string |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DB_PATH` | `./saldomint.db` | Path to the SQLite database file |
| `PORT` | `8000` | Port for the API server |
| `SECRET_KEY` | — | JWT signing secret (set in production) |
