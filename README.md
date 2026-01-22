# Tasks App (API + Web + Mobile)

Test project that includes:

- **API**: Express + TypeScript + Prisma + PostgreSQL (Docker)
- **Web**: Angular + TailwindCSS
- **Mobile**: Ionic Angular (2 screens: Login, Tasks List)

---

## Project structure

api/ # Express API (TS), Prisma schema/migrations, auth middleware
web/ # Angular web app + TailwindCSS
mobile/ # Ionic Angular mobile app (Login, Tasks List)
docker-compose.yml

## Requirements

- Node.js + npm
- Docker + Docker Compose

---

## Quick start

### 1) Start PostgreSQL (Docker)

From repository root:
bash
docker compose up -d
docker compose ps

Expected: db container is healthy.
If your DB is exposed on a non-default port (e.g. 5433), keep that consistent in DATABASE_URL

### 2) API setup

bash
cd api
npm install

-Create .env from .env.example:
bash
cp .env.example .env

-Run migrations and generate Prisma client:
bash
npm exec prisma migrate dev
npm exec prisma generate

-Start API:
bash
npm run dev

API should be available on: http://localhost:3000
Health check:GET http://localhost:3000/health

### 2) Web setup

bash
cd ../web
npm install
npm start

Web app: http://localhost:4200
Web uses the same API endpoints. If you use an Angular proxy, /api/\* is forwarded to the API server.

### 3) Mobile setup

bash
cd ../mobile
npm install
npm run start

Mobile (dev server): http://localhost:8100
Mobile uses the same API endpoints as Web.
In browser mode it can use http://localhost:3000.
For Android emulator, replace host with http://10.0.2.2:3000

### Environment variables

api/.env.example

# API

PORT=3000

# Auth

-API expects: Authorization: Bearer <token>
AUTH_TOKEN=valid-token

# Database

-Example when Postgres is mapped to localhost:5433
DATABASE_URL="postgresql://tasks_user:tasks_password@localhost:5433/tasks_app?schema=public"

-Adjust host/port according to your docker-compose settings.

### API

## Authentication

Login endpoint returns a token. Other endpoints require: Authorization: Bearer <token>

## Endpoints

# POST /api/login

-Request: { "email": "test@example.com", "password": "123456" }
-Response: { "token": "valid-token" }

# GET /api/tasks (auth required)

-Returns list of tasks

# POST /api/tasks (auth required)

-Request: { "title": "buy milk!" }

# GET /api/tasks/:id (auth required)

-Returns a single task (including notes)

# POST /api/tasks/:id/notes

-Request: { "text": "#fix button broken" }
