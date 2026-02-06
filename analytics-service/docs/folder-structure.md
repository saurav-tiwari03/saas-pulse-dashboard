## 📁 Folder Structure (Clean Architecture)

This project follows **Clean Architecture**, where business logic is independent of frameworks, databases, and delivery mechanisms.

### `cmd/`
**Application entry points**
- `cmd/server/main.go` – Bootstraps the app, loads config, initializes DB/Kafka/logger, starts HTTP server  
- No business logic here (only wiring)

---

### `internal/config/`
**Configuration management**
- Loads env variables (`.env`)
- Holds application config structs

---

### `internal/domain/` (Core Business Layer)
**Pure business rules – framework agnostic**

- `entities/`  
  Core business models (Event, Order, Metric)  
  → No DB / JSON / Kafka dependencies

- `repositories/`  
  Repository interfaces (contracts)  
  → Defines *what* data operations are needed, not *how*

- `services/`  
  Domain services  
  → Business rules that don’t belong to a single entity

---

### `internal/usecase/` (Application Logic)
**What the system can do**
- Orchestrates domain + repositories
- One file = one use case  
  (e.g. ingest event, build metrics, get dashboard)
- No HTTP, no DB, no Kafka code

---

### `internal/delivery/` (Interface Adapters)
**How the outside world talks to the app**

- `http/handlers/` – HTTP → Usecase mapping  
- `http/middleware/` – Auth, logging, etc.  
- `http/router.go` – Route definitions only

---

### `internal/infrastructure/` (External Systems)
**Frameworks & tools**

- `database/` – Mongo connection setup  
- `kafka/` – Producers & consumers  
- `logger/` – Zap logger configuration  

> Infrastructure depends on domain, never the opposite.

---

### `internal/repository/mongo/`
**Concrete DB implementations**
- Mongo implementation of domain repository interfaces
- Contains query logic only

---

### `scripts/`
- Helper scripts (e.g. Kafka topic creation)

---

### Root Files
- `docker-compose.yml` – Local infra (Mongo, Kafka, etc.)
- `.env` – Environment variables
- `go.mod` – Dependencies
- `README.md` – Project documentation

---

### 🧠 Clean Architecture Rule
Dependencies always point **inward**:

