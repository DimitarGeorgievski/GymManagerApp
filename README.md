# GymManagerApp

[![Architecture diagram of dimitargeorgievski/gymmanagerapp](https://gitdiagram.com/dimitargeorgievski/gymmanagerapp/diagram.png)](https://gitdiagram.com/dimitargeorgievski/gymmanagerapp?utm_source=readme&utm_medium=picture)

## Project Description
GymManagerApp is a full-stack application for managing gym operations. It centralizes member data, workout tracking, nutrition monitoring, and training plan management into a single platform.

## Technology Stack

**Frontend:**
- React v19 + Vite
- React Router DOM
- Axios
- Zustand
- Tailwind CSS v4
- Lucide React

**Backend:**
- NestJS v11
- TypeORM
- PostgreSQL 17
- bcryptjs (8 rounds)
- class-validator / class-transformer
- @nestjs/jwt
- @nestjs/throttler
- Swagger/OpenAPI

**Tools:**
- Docker, Docker Compose v2
- Jest
- Git

## Key Features
- User authentication with two-phase tokens (access + refresh)
- Role-based access control (USER/TRAINER)
- Workout management with exercise mapping
- Nutrition/food tracking with daily summaries
- Training plan creation and assignment
- Trainer-client relationship management
- PostgreSQL with idempotent seed data
- Docker Compose (normal + development modes)

## Project Structure
- `client/` - React frontend with Vite
- `server/` - NestJS backend
- `docker-compose.yaml` - Normal mode compose file
- `docker-compose.dev.yaml` - Development mode compose file
- `server/src/init/db/init.sql` - Idempotent seed data
- `PROJECT_PRESENTATION.md` - Presentation documentation

## Prerequisites
- Docker and Docker Compose v2
- Node.js (for development mode)
- PostgreSQL 17 (or use Docker)
- Git

## Startup Commands
- From root: `docker compose up --build` (normal mode)
- Development: `docker compose -f docker-compose.dev.yaml up --build` (dev mode)
- Stop: `docker compose down --volumes --remove-orphans`
- Dev stop: `docker compose -f docker-compose.dev.yaml down --volumes --remove-orphans`

## Link to Presentation
- [PROJECT_PRESENTATION.md](PROJECT_PRESENTATION.md)