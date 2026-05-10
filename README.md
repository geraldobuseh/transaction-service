# Transact App

Transact App is a full-stack transaction intelligence platform with a Spring Boot backend, Drools rule decisioning, SQL Server persistence, Docker Compose infrastructure, and a React/Vite frontend.

## Repository Layout

- `src/main/java` - Spring Boot backend
- `docker` - SQL Server initialization scripts
- `docker-compose.yml` - backend application and SQL Server runtime
- `frontend` - React, Vite, Tailwind CSS frontend

## Backend

Run the backend stack with Docker Compose:

```powershell
docker compose down
docker compose up --build -d
docker compose logs -f app
docker compose ps
```

The backend API is available at:

```text
http://localhost:8080/api/transactions
```

## Frontend

Install and run the frontend:

```powershell
cd frontend
npm install
npm run dev
```

The frontend is available at:

```text
http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:8080`, and the backend also allows `http://localhost:5173` through local CORS configuration.

If Node.js is not installed on the host, run the frontend through Docker:

```powershell
docker run --rm -it `
  -e VITE_BACKEND_PROXY_TARGET=http://host.docker.internal:8080 `
  -v "${PWD}\frontend:/app" `
  -w /app `
  -p 5173:5173 `
  node:22-alpine npm run dev -- --host 0.0.0.0
```

## API Test Body

```json
{
  "userId": "merchant1",
  "amount": 25000,
  "type": "DEBIT",
  "description": "large transfer"
}
```

## SQL Server Verification

```sql
SELECT * FROM transactions;
```
