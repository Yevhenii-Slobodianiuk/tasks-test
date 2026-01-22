# Tasks App (API + Web + Mobile)

Test project that includes:

- **API**: Express + TypeScript + Prisma + PostgreSQL (Docker)
- **Web**: Angular + TailwindCSS
- **Mobile**: Ionic Angular (2 screens: Login, Tasks List)

---

## Project structure

api/ # Express API (TS), Prisma schema/migrations, auth middleware <br>
web/ # Angular web app + TailwindCSS <br>
mobile/ # Ionic Angular mobile app (Login, Tasks List) <br>
docker-compose.yml <br>

## Requirements

- Node.js + npm <br>
- Docker + Docker Compose <br>

---

## Quick start

### 1) Start PostgreSQL (Docker)

From repository root: <br>
bash <br>
docker compose up -d <br>
docker compose ps <br>

Expected: db container is healthy. <br>
If your DB is exposed on a non-default port (e.g. 5433), keep that consistent in DATABASE_URL <br>

---

### 2) API setup

bash <br>
cd api <br>
npm install <br>

-Create .env from .env.example: <br>
bash <br>
cp .env.example .env <br>

-Run migrations and generate Prisma client: <br>
bash <br>
npm exec prisma migrate dev <br>
npm exec prisma generate <br>

-Start API: <br>
bash <br>
npm run dev <br>

API should be available on: http://localhost:3000 <br>
Health check:GET http://localhost:3000/health <br>

---

### 3) Web setup

-In new terminal: <br>
bash <br>
cd web <br>
npm install <br>
npm start <br>

Web app: http://localhost:4200 <br>
Web uses the same API endpoints. If you use an Angular proxy, /api/\* is forwarded to the API server. <br>

---

### 4) Mobile setup

-In new terminal: <br>
bash <br>
cd mobile <br>
npm install <br>
npm run start <br>

Mobile (dev server): http://localhost:8100 <br>
Mobile uses the same API endpoints as Web. <br>

---

### 5) Environment variables

api/.env.example <br>

-API<br>
PORT=3000 <br>

-Auth <br>
-API expects: Authorization: Bearer <token> <br>
AUTH_TOKEN=valid-token <br>

-Database<br>
-Example when Postgres is mapped to localhost:5433 <br>
DATABASE_URL="postgresql://tasks_user:tasks_password@localhost:5433/tasks_app?schema=public" <br>

-Adjust host/port according to your docker-compose settings. <br>

---

### API

-Authentication<br>
Login endpoint returns a token. Other endpoints require: Authorization: Bearer <token> <br>

### Endpoints

#### POST /api/login

-Request: { "email": "test@example.com", "password": "123456" } <br>
-Response: { "token": "valid-token" } <br>

#### GET /api/tasks (auth required)

-Returns list of tasks <br>

#### POST /api/tasks (auth required)

-Request: { "title": "buy milk!" } <br>

#### GET /api/tasks/:id (auth required)

-Returns a single task (including notes) <br>

#### POST /api/tasks/:id/notes

-Request: { "text": "#fix button broken" } <br>

### Usefull command

-In /api: <br>
bash <br>
npm exec prisma studio <br>
Check your db <br>
