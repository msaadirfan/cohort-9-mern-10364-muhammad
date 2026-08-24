# MyNotes — MERN Notes App

Cohort 9 — MERN (Node.js + React) assignment for Muhammad Saad Irfan.

A full-stack notes application with JWT-based authentication (access + refresh tokens), a rich-text note editor (Tiptap), and a React/Vite frontend styled with Tailwind + DaisyUI.

> **Note:** The code lives on the `develop` branch, not `main`. Make sure you check it out after cloning.

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) for access/refresh tokens, sessions stored in MongoDB
- `bcrypt` for password hashing
- `cookie-parser`, `cors`, `morgan`, `pino` for logging
- `mocha` + `chai` + `supertest` for tests

**Frontend**
- React 19 + Vite
- React Router
- Axios (with an interceptor that auto-refreshes the access token on 401)
- Tailwind CSS + DaisyUI
- Tiptap rich text editor
- `react-hot-toast` for notifications
- `jest` + `@testing-library/react` for tests

## Project Structure

```text
cohort-9-mern-10364-muhammad/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection (Mongoose)
│   │   ├── controllers/   # auth + notes controllers
│   │   ├── middleware/    # auth middleware, error handler
│   │   ├── models/        # User, Note, Session (Mongoose schemas)
│   │   ├── routes/        # /auth and /notes routers
│   │   ├── utils/         # logger, ApiError
│   │   ├── validators/    # request validation for auth + notes
│   │   └── server.js      # app entrypoint
│   └── tests/             # mocha/chai/supertest tests
└── frontend/
    ├── src/
    │   ├── api/            # axios instance + token refresh interceptor
    │   ├── components/     # Navbar, NoteEditorModal, NoteViewModal, ProtectedRoute
    │   ├── context/        # auth context/provider
    │   ├── pages/          # Login, Register, Dashboard, Profile, NotFound
    │   └── tests/          # jest/RTL tests
    └── vite.config.js
```

## Prerequisites

- Node.js 18+ and npm
- A MongoDB instance — either a local MongoDB server or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## Getting Started

### 1. Clone the repo and switch to `develop`

```bash
git clone https://github.com/msaadirfan/cohort-9-mern-10364-muhammad.git
cd cohort-9-mern-10364-muhammad
git checkout develop
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the following variables:

```env
# backend/.env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/mynotes
JWT_SECRET=replace_with_a_long_random_secret_string
```

| Variable     | Required | Description                                                                                      |
|--------------|----------|----------------------------------------------------------------------------------------------------|
| `PORT`       | No       | Port the Express server listens on. Defaults to `3000` if not set.                                |
| `MONGO_URI`  | **Yes**  | MongoDB connection string. App throws and refuses to start if this is missing.                   |
| `JWT_SECRET` | **Yes**  | Secret used to sign/verify both access and refresh JWTs. App throws and refuses to start if missing. |

> The frontend's axios client is hardcoded to call the backend at `http://localhost:3000`, so keep `PORT=3000` unless you also update `frontend/src/api/axios.js`.

Run the backend (dev):

```bash
npm run dev
```

Run backend tests:

```bash
npm test
```

### 3. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on Vite's default dev port (`http://localhost:5173`), which matches the CORS origin already configured on the backend.

Run frontend tests:

```bash
npm test
```

Other useful frontend scripts:

```bash
npm run lint      # ESLint
npm run build     # production build
npm run preview   # preview the production build
```

## How Authentication Works

- On register/login, the backend issues:
  - A short-lived **access token** (15 min) returned in the JSON response body — the frontend stores this in memory/context and sends it as `Authorization: Bearer <token>`.
  - A long-lived **refresh token** (7 days) set as an `httpOnly`, `secure`, `sameSite=strict` cookie.
- Each refresh token is hashed (SHA-256) and stored in a `Session` document in MongoDB, so sessions can be individually revoked (e.g. on logout).
- The frontend's axios interceptor automatically calls `POST /auth/refresh-token` when it gets a `401`, retrieves a new access token, and retries the original request.

### Backend API Routes

**Auth** (`/auth`)

| Method | Route                 | Description                                                              | Credentials required                                        |
|--------|------------------------|---------------------------------------------------------------------------|---------------------------------------------------------------|
| POST   | `/auth/register`       | Create a new user                                                        | None                                                           |
| POST   | `/auth/login`          | Log in, receive access token + refresh cookie                            | None                                                           |
| GET    | `/auth/me`             | Get the current user                                                     | `Authorization: Bearer <accessToken>` **and** refresh token cookie |
| POST   | `/auth/refresh-token`  | Exchange refresh cookie for a new access token                           | Refresh token cookie                                           |
| POST   | `/auth/logout`         | Revoke the current session                                               | Refresh token cookie                                           |

**Notes** (`/notes`, all require `Authorization: Bearer <accessToken>`)

| Method | Route         | Description            |
|--------|---------------|-------------------------|
| POST   | `/notes`      | Create a note           |
| GET    | `/notes`      | List the user's notes   |
| GET    | `/notes/:id`  | Get a single note       |
| PATCH  | `/notes/:id`  | Edit a note             |
| DELETE | `/notes/:id`  | Delete a note           |

## Notes / Gotchas

- Because the refresh-token cookie is set with `secure: true`, most browsers will only send it over HTTPS or on `localhost` during local dev — if you deploy behind plain HTTP you'll need to adjust that flag.
- `.env` is not committed (and there's currently no `.env.example` in the repo) — use the table above to create your own.
- Make sure MongoDB is running/reachable before starting the backend; `connectDB()` throws immediately if `MONGO_URI` is missing or unreachable.
