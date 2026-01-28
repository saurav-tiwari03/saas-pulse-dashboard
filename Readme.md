# E-Commerce Analytics Platform

A full-stack e-commerce platform with real-time analytics capabilities, built using a microservices architecture for high-throughput event processing.

## System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────┐
│  frontend-store │     │   admin-panel   │     │ analytics-dashboard │
│    (Next.js)    │     │  (React/Vite)   │     │    (React/Vite)     │
│   :3001         │     │   :3002         │     │      :3003          │
└────────┬────────┘     └────────┬────────┘     └──────────┬──────────┘
         │                       │                         │
         │ REST API              │ REST API                │ WebSocket
         ▼                       ▼                         ▼
┌─────────────────────────────────────────┐    ┌─────────────────────┐
│              backend-api                │    │  analytics-service  │
│           (Node.js) :5005               │    │     (Go) :8080      │
│  • Auth  • Products  • Orders  • Users  │    │  • Event Ingestion  │
└──────────────┬──────────────────────────┘    │  • RabbitMQ Producer│
               │                               │  • Batch Processing │
               │                               └──────────┬──────────┘
               │                                          │
      ┌────────┴────────┐                      ┌──────────▼──────────┐
      ▼                 ▼                      │      RabbitMQ       │
┌──────────┐     ┌──────────┐                  │  :5672 (AMQP)       │
│  Redis   │     │ Postgres │                  │  :15672 (UI)        │
│  :6379   │     │  :5432   │                  └──────────┬──────────┘
└──────────┘     └──────────┘                             │
                                               ┌──────────▼──────────┐
                                               │      MongoDB        │
                                               │       :27017        │
                                               └─────────────────────┘
```

## Project Structure

| Folder | Description | Tech Stack |
|--------|-------------|------------|
| `/frontend-store` | Customer-facing e-commerce storefront with product listings, cart, and checkout | Next.js, TypeScript, Tailwind CSS |
| `/admin-panel` | Admin dashboard for managing products, orders, and inventory | React, Vite, TypeScript |
| `/backend-api` | REST API for authentication, products, orders, and user management | Node.js, Express, PostgreSQL |
| `/analytics-dashboard` | Real-time analytics visualization with live updates | React, Vite, WebSocket, Charts |
| `/analytics-service` | High-throughput event ingestion and processing service | Go, RabbitMQ, MongoDB |

## Features

### Frontend Store
- Product catalog with search and filtering
- Shopping cart and checkout flow
- User authentication and profiles
- Order history and tracking

### Admin Panel
- Product CRUD operations
- Inventory management
- Order management and fulfillment
- User management

### Analytics Dashboard
- Real-time visitor tracking via WebSocket
- Sales and revenue analytics
- User behavior analysis
- Custom date range reports

### Analytics Service
- High-throughput event ingestion (Go REST API)
- Message queuing with RabbitMQ for traffic spike handling
- Batch processing for efficient database writes
- Event aggregation and metrics computation

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js, React, Vite, TypeScript, Tailwind CSS |
| **Backend API** | Node.js, Express, PostgreSQL, Prisma ORM, Swagger |
| **Analytics** | Go, RabbitMQ, MongoDB, WebSocket |
| **Infrastructure** | Docker, Docker Compose |

## Local Development Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js 18+](https://nodejs.org/)
- [Go 1.21+](https://golang.org/dl/)
- [pnpm](https://pnpm.io/) (recommended) or npm

### Step 1: Clone and Setup Infrastructure

```bash
# Clone the repository
git clone <repository-url>
cd analytic-tool

# Start all infrastructure services
docker-compose up -d
```

This starts the following services:

| Service | Port | Description | Credentials |
|---------|------|-------------|-------------|
| PostgreSQL | 5432 | Product & user database | `ecommerce` / `ecommerce_secret` |
| MongoDB | 27017 | Analytics database | `analytics` / `analytics_secret` |
| RabbitMQ | 5672, 15672 | Message broker | `rabbitmq` / `rabbitmq_secret` |
| Redis | 6379 | Cache & sessions | No auth |

### Step 2: Verify Services are Running

```bash
# Check all containers are healthy
docker-compose ps

# View logs if needed
docker-compose logs -f
```

**Access Management UIs:**
- RabbitMQ Dashboard: http://localhost:15672 (login: `rabbitmq` / `rabbitmq_secret`)

### Step 3: Start Application Services

Open separate terminal windows for each service:

**Terminal 1 - Backend API:**
```bash
cd backend-api
npm install
cp .env.example .env  # Configure environment variables

# Generate Prisma client and run database migrations
npm run prisma:generate
npm run prisma:migrate

npm run dev
# Runs on http://localhost:5005
# API Docs: http://localhost:5005/api-docs
```

**Terminal 2 - Analytics Service:**
```bash
cd analytics-service
cp .env.example .env  # Configure environment variables
go mod download
go run main.go
# Runs on http://localhost:8080
```

**Terminal 3 - Frontend Store:**
```bash
cd frontend-store
npm install
cp .env.example .env.local  # Configure environment variables
npm run dev
# Runs on http://localhost:3001
```

**Terminal 4 - Admin Panel:**
```bash
cd admin-panel
npm install
cp .env.example .env  # Configure environment variables
npm run dev
# Runs on http://localhost:3002
```

**Terminal 5 - Analytics Dashboard:**
```bash
cd analytics-dashboard
npm install
cp .env.example .env  # Configure environment variables
npm run dev
# Runs on http://localhost:3003
```

## Environment Variables

### Backend API (`backend-api/.env`)
```env
NODE_ENV=development
PORT=5005

# Database - PostgreSQL (Prisma)
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/your-database?schema=public"

# Swagger API Documentation
SWAGGER_ENABLED=true
SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=change-this-password
```

### Analytics Service (`analytics-service/.env`)
```env
PORT=8080

# RabbitMQ
RABBITMQ_URL=amqp://rabbitmq:rabbitmq_secret@localhost:5672/

# MongoDB
MONGODB_URI=mongodb://analytics:analytics_secret@localhost:27017/analytics_db?authSource=admin
```

### Frontend Store (`frontend-store/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5005
NEXT_PUBLIC_ANALYTICS_URL=http://localhost:8080
```

### Admin Panel (`admin-panel/.env`)
```env
VITE_API_URL=http://localhost:5005
```

### Analytics Dashboard (`analytics-dashboard/.env`)
```env
VITE_API_URL=http://localhost:5005
VITE_ANALYTICS_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
```

## Docker Commands Reference

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (clears all data)
docker-compose down -v

# View logs
docker-compose logs -f [service-name]

# Restart a specific service
docker-compose restart [service-name]

# Check service status
docker-compose ps

# Execute command in container
docker-compose exec postgres psql -U ecommerce -d ecommerce_db
docker-compose exec mongodb mongosh -u analytics -p analytics_secret
```

## Prisma Commands (Backend API)

```bash
cd backend-api

# Generate Prisma Client (run after schema changes)
npm run prisma:generate

# Create and apply migrations (development)
npm run prisma:migrate

# Apply migrations (production)
npm run prisma:migrate:prod

# Push schema changes directly (skip migrations, useful for prototyping)
npm run prisma:push

# Open Prisma Studio (visual database browser)
npm run prisma:studio
# Opens on http://localhost:5555
```

## Database Access

### PostgreSQL
```bash
# Connect via Docker
docker-compose exec postgres psql -U ecommerce -d ecommerce_db

# Or using local client
psql postgresql://ecommerce:ecommerce_secret@localhost:5432/ecommerce_db
```

### MongoDB
```bash
# Connect via Docker
docker-compose exec mongodb mongosh -u analytics -p analytics_secret --authenticationDatabase admin

# Or using connection string
mongosh "mongodb://analytics:analytics_secret@localhost:27017/analytics_db?authSource=admin"
```

## API Documentation

Once services are running:
- **Backend API**: http://localhost:5005/api-docs (Swagger UI, no auth required in development)
- **Analytics Service**: http://localhost:8080/docs

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :5432  # or any port

# Kill process
kill -9 <PID>
```

### Container Won't Start
```bash
# Check logs for specific service
docker-compose logs postgres

# Rebuild containers
docker-compose up -d --build
```

### Database Connection Issues
1. Ensure containers are running: `docker-compose ps`
2. Check container health: `docker-compose ps` should show "healthy"
3. Verify credentials match `.env` files

## License

MIT
