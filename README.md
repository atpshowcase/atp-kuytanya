# ATP WhatsApp Chatbot

A full-stack WhatsApp auto-reply chatbot.

| Layer    | Tech                     |
|----------|--------------------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend  | Go 1.22, Gin, GORM       |
| Database | PostgreSQL               |
| API      | Meta WhatsApp Business Cloud API |

## Project Structure

```
atp-chatbot/
├── frontend/        # Next.js dashboard
└── backend/         # Go REST API + webhook
```

## Quick Start

### 1. Backend
```bash
cd backend
cp .env.example .env    # fill in your credentials
go run main.go          # starts on :8080
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev             # starts on :3000
```

### 3. Full setup guide
Open http://localhost:3000/setup for step-by-step instructions to connect to Meta's WhatsApp API.

## API Endpoints

| Method | Endpoint           | Description                       |
|--------|--------------------|-----------------------------------|
| GET    | /webhook           | Meta webhook verification         |
| POST   | /webhook           | Receive incoming WhatsApp messages |
| GET    | /api/messages      | List recent messages              |
| GET    | /api/replies       | List auto-reply rules             |
| POST   | /api/replies       | Create auto-reply rule            |
| PUT    | /api/replies/:id   | Update rule                       |
| DELETE | /api/replies/:id   | Delete rule                       |
| GET    | /health            | Health check                      |
