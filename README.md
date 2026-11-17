# FINORA - Financial Operations & Intelligence Platform
Phase 1: arsitektur, auth (register, login, lupa/reset password, refresh token rotation), RBAC, landing page, shell dashboard responsif.

## Menjalankan
1. `docker compose up -d`  (PostgreSQL + Redis)
2. Backend: `cd backend && cp .env.example .env && npm i && npx prisma migrate dev --name init && npm run dev`  (port 4000)
3. Frontend: `cd frontend && cp .env.example .env.local && npm i && npm run dev`  (port 3000)

Email reset password di mode development dicetak ke console backend (belum ada SMTP).
Detail arsitektur dan ERD: `docs/ARCHITECTURE.md`.
