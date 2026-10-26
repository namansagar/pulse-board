# PulseBoard

Live pulse checks for teams and classes. A host creates a room with one question,
people join with a 5-character code and vote 1-5, and the results update live.

**Stack:** Java 17 + Spring Boot 3 (REST, JPA) / PostgreSQL / React + Vite + Tailwind / Nginx / Docker Compose

## Run with Docker

```bash
docker compose up --build
```

Open http://localhost (Nginx serves the React app and proxies `/api` to Spring Boot).

## Run locally (no Docker)

1. Start a Postgres database named `pulseboard` (user `pulse`, password `pulse_pw`), or override
   `DB_URL`, `DB_USER`, `DB_PASSWORD`.
2. Backend: `cd backend && mvn spring-boot:run` (port 8080)
3. Frontend: `cd frontend && npm install && npm run dev` (port 5173, proxies `/api` to 8080)

## API

| Method | Path | Description |
|---|---|---|
| POST | `/api/rooms` | Create a room `{ "question": "..." }`. Returns the room and a `hostKey` |
| GET | `/api/rooms/{code}` | Room info + live results |
| POST | `/api/rooms/{code}/votes` | Vote `{ "nickname": "Sam", "score": 4 }` (voting again replaces your vote) |
| POST | `/api/rooms/{code}/close` | Close voting. Needs header `X-Host-Key` |

There is no login. The host's key is kept in the browser's localStorage, so only the
browser that created the room can close it.
