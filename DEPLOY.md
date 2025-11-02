# Deploying Tic-Tac-Toe-Game (GameHub)

This repository is a monorepo with two deployable parts:

- frontend/ – React app (Create React App) → Deploy on Netlify
- backend/ – Spring Boot API + WebSocket → Deploy on a server provider (Render, Railway, Fly.io, etc.)

Netlify can only host the frontend. The backend must be hosted separately and exposed via a public URL that the frontend calls.

## Prerequisites

- Code pushed to GitHub (public or private)
- A Netlify account (for the frontend)
- A server provider for the backend (examples below use Render, but Railway/Fly.io work too)

---

## 1) Deploy the frontend to Netlify

Your repo already contains `frontend/netlify.toml` and `public/_redirects` which are correct for a CRA app and client‑side routing.

1. In Netlify, click “Add new site” → “Import an existing project” → choose GitHub and select this repository.
2. When asked for settings, set:
   - Base directory: `frontend`
   - Build command: `npm run build` (or leave blank to use `netlify.toml`)
   - Publish directory: `build`
3. Environment variables → add:
   - `REACT_APP_API_URL` = `https://YOUR-BACKEND-HOST` (no trailing slash)
     - The frontend reads this at build time (see `frontend/src/services/api.js`).
4. Deploy. Netlify will install dependencies and run the build in the `frontend` directory.

Notes:
- You can later update `REACT_APP_API_URL` in Netlify and trigger a redeploy without code changes.
- WebSockets: the frontend should connect to your backend’s `/ws` endpoint using the same host as `REACT_APP_API_URL`.

---

## 2) Deploy the backend (Spring Boot)

Spring Boot cannot run on Netlify. Below is an example using Render (free tier often sufficient). You can adapt to Railway/Fly.io/Heroku/etc.

### Option A: Render Web Service

1. In Render, click “New +” → “Web Service” → connect the GitHub repo.
2. Monorepo settings:
   - Root Directory: `backend`
3. Runtime/build commands:
   - Build Command: `./mvnw -DskipTests package`
   - Start Command: `java -Dserver.port=$PORT -jar target/backend-0.0.1-SNAPSHOT.jar`
     - Render provides `$PORT`; the `-Dserver.port=$PORT` overrides `server.port=8081` from `application.properties`.
4. Environment variables (example for MySQL):
   - `SPRING_DATASOURCE_URL` = `jdbc:mysql://HOST:3306/DBNAME?useSSL=false&serverTimezone=UTC`
   - `SPRING_DATASOURCE_USERNAME` = `...`
   - `SPRING_DATASOURCE_PASSWORD` = `...`
   - Optional: `SPRING_JPA_HIBERNATE_DDL_AUTO` = `update`

Once deployed, Render gives you a public URL, e.g. `https://gamehub-backend.onrender.com`. Use that URL in Netlify as `REACT_APP_API_URL`.

### Option B: Railway or Fly.io

- Railway: create a service from GitHub, set root to `backend`, set build/start commands as above, and add a MySQL plugin or use an external MySQL provider (PlanetScale, Aiven, etc.).
- Fly.io: package as a Docker image or use the Java builder; expose the port and set the same env vars.

### CORS

The backend currently allows CORS broadly (see `backend/src/main/java/com/gamehub/backend/config/SecurityConfig.java`). For production, consider restricting allowed origins to your Netlify site URL.

---

## 3) Wire it up

1. Deploy backend → copy its public URL.
2. In Netlify Site Settings → Environment variables, set `REACT_APP_API_URL` to that backend URL.
3. Redeploy the Netlify site to bake the URL into the frontend bundle.

---

## 4) Local quick checks (optional)

- Frontend: from `frontend/` run `npm start`.
- Backend: from `backend/` run `./mvnw spring-boot:run` (ensure MySQL is available). The backend uses port `8081` by default in `application.properties`.

---

## Troubleshooting

- 404 on refresh: ensure `public/_redirects` or `netlify.toml` has `/* /index.html 200` (already present).
- CORS errors in browser console: verify backend CORS config and that `REACT_APP_API_URL` matches the backend host and scheme (https vs http).
- WebSocket issues: make sure your backend host allows WebSockets and that the frontend connects to the correct `/ws` path and protocol (`wss://` on https sites).
- Database connection failures: confirm the `SPRING_DATASOURCE_*` env variables; ensure the DB is reachable from your host.
