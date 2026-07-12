# KuyTanya

KuyTanya is an open-source WhatsApp auto-reply dashboard. It lets users connect a WhatsApp session, define keyword-based replies, and monitor incoming messages from a web dashboard.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Go, Gin, GORM |
| Database | PostgreSQL |
| WhatsApp client | whatsmeow |

## Project Structure

```text
.
├── backend/      # Go API, authentication, WhatsApp client, data access
├── frontend/     # Next.js dashboard
└── docker-compose.yml
```

## Environment Files

Use the environment template that matches your target:

- `.env.development.example`
- `.env.staging.example`
- `.env.production.example`

Copy one to `.env` and replace every secret before running the app.

Required variables:

| Variable | Purpose |
| --- | --- |
| `APP_ENV` | `development`, `staging`, or `production` |
| `DATABASE_URL` | PostgreSQL URL for application data |
| `WA_DB_URL` | PostgreSQL URL for WhatsApp session storage |
| `JWT_SECRET` | Random secret for auth tokens |
| `FRONTEND_URL` | Public frontend origin |
| `NEXT_PUBLIC_API_URL` | Public backend API URL used by the frontend |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed browser origins |
| `COOKIE_SECURE` | Set to `true` when serving over HTTPS |

## Run with Docker

```bash
cp .env.development.example .env
docker compose up --build
```

The default development setup serves:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

## Run Locally

Start PostgreSQL first, then update `DATABASE_URL` and `WA_DB_URL` to point to your local database host.

```bash
cd backend
cp .env.example .env
go run .
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/register` | Create a user |
| `POST` | `/api/login` | Log in and set the auth cookie |
| `POST` | `/api/auth/logout` | Clear the auth cookie |
| `GET` | `/api/auth/me` | Return the current user |
| `GET` | `/api/qr` | Return a WhatsApp login QR code |
| `GET` | `/api/status` | Return WhatsApp connection status |
| `POST` | `/api/logout` | Disconnect and reset WhatsApp session |
| `GET` | `/api/replies` | List auto-reply rules |
| `POST` | `/api/replies` | Create an auto-reply rule |
| `PUT` | `/api/replies/:id` | Update an auto-reply rule |
| `DELETE` | `/api/replies/:id` | Delete an auto-reply rule |
| `GET` | `/api/messages` | List recent incoming messages |
| `GET` | `/health` | Health check |

## Architecture

The backend separates responsibilities into small layers:

- `config`: environment loading and validation
- `db`: database connection and migrations
- `models`: persistent data models
- `repositories`: data access functions
- `services`: reusable business concerns such as auth token creation
- `handlers`: HTTP request and response logic
- `middleware`: request guards
- `whatsapp`: WhatsApp session and event handling

## License

This project is released under the MIT License. See [LICENSE](LICENSE).
