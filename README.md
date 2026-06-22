# OpKit Mini CRM

## 1. Project Overview

Mini-CRM with real-time task updates built as a technical interview assignment for OpKit / Circle Creative Buro. The app includes JWT authentication, owner-scoped task CRUD, a Kanban board, and Socket.io updates backed by Redis pub/sub.

## 2. Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | NestJS, TypeScript, Prisma ORM, PostgreSQL, Redis, Socket.io, JWT, bcrypt |
| Frontend | React 18, TypeScript, Vite, socket.io-client, axios, CSS Modules |
| Infrastructure | Docker, Docker Compose |

## 3. Features

- JWT authentication with register/login
- Task CRUD scoped to authenticated user
- Kanban board with TODO / IN_PROGRESS / DONE columns
- Real-time status updates via WebSocket: open two browsers and changes sync instantly
- Status transition validation: TODO -> IN_PROGRESS -> DONE only
- Redis adapter for Socket.io production-ready pub/sub
- Docker Compose for one-command local setup

## 4. Quick Start

### Option A - Docker Compose Recommended

```bash
git clone <repo>
cd opkit
cp .env.example .env
docker-compose up --build
```

Then open http://localhost:5173.

### Option B - Manual

Prerequisites: Node.js 20+, PostgreSQL 15, Redis 7.

```bash
# 1. Start PostgreSQL and Redis
docker-compose up postgres redis -d

# 2. Backend
cd backend
cp ../.env.example .env
pnpm install
npx prisma migrate dev
pnpm run start:dev

# 3. Frontend in a new terminal
cd frontend
pnpm install
pnpm run dev
```

## 5. Project Structure

```text
OpKit/
├── backend/                 NestJS API, Prisma schema, auth, tasks, WebSocket gateway
│   ├── prisma/              Prisma database schema and migrations
│   └── src/                 Application source modules
│       ├── auth/            Register, login, JWT strategy and guard
│       ├── common/          Shared decorators, filters, interceptors, middleware, Redis adapter
│       ├── prisma/          Global Prisma module and service
│       └── tasks/           Task CRUD and task WebSocket gateway
├── frontend/                React 18 Vite application
│   └── src/                 API clients, auth context, hooks, pages, components, types
├── docker-compose.yml       Development services for Postgres, Redis, backend, frontend
├── docker-compose.prod.yml  Production-oriented compose file
├── .env.example             Example environment variables
└── README.md                Project documentation
```

## 6. Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| DATABASE_URL | PostgreSQL connection string | postgresql://user:password@postgres:5432/opkit |
| REDIS_URL | Redis connection string for Socket.io adapter | redis://redis:6379 |
| JWT_SECRET | Secret used to sign JWT access tokens | change-me-in-production |
| PORT | Backend HTTP port | 3000 |

When running with Docker Compose, use service names such as `postgres` and `redis` as hostnames. When running locally without Docker, use `localhost`.

## 7. API Documentation

Swagger is available at http://localhost:3000/api/docs.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | /api/auth/register | No | Register a user |
| POST | /api/auth/login | No | Login and receive an access token |
| GET | /api/tasks | Yes | List current user tasks |
| POST | /api/tasks | Yes | Create a task |
| PATCH | /api/tasks/:id | Yes | Update task fields or status |
| DELETE | /api/tasks/:id | Yes | Delete a task |

### WebSocket

- Connect to: `ws://localhost:3000`
- Event listened: `task:statusChanged`
- Payload: `{ taskId, status, timestamp }`

## 8. Testing WebSocket Manually

1. Start the app and open http://localhost:5173 in two browser tabs.
2. Login with the same account in both tabs.
3. Create a task if none exists.
4. Change the task status in tab 1.
5. Watch tab 2 update the task status automatically without refreshing.
