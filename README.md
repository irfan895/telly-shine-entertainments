# Telly Shine Entertainment

Full-stack entertainment news platform built with React, Vite, Tailwind CSS, Redux Toolkit, Node.js, Express, MongoDB, Firebase Authentication, and Appwrite Storage.

## Project Structure

- `frontend/` — React + Vite + Tailwind CSS + Redux Toolkit + Firebase Web SDK + Appwrite Web SDK
- `backend/` — Node.js + Express + Mongoose (`telly_shine_db`) + Firebase Admin SDK + JWT HTTP-only cookies

## Prerequisites

- Node.js 18+
- MongoDB running locally at `mongodb://127.0.0.1:27017/telly_shine_db`
- Firebase project (`shine-ae3df`) with Google Authentication enabled
- Appwrite project (optional, required for uploading new article featured images)

## Setup & Installation

### 1. Backend

```bash
cd backend
npm install
```

Configure `backend/.env` (see `backend/.env.example`):

```env
MONGO_URI=mongodb://127.0.0.1:27017/telly_shine_db
JWT_SECRET=your_long_random_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
FIREBASE_PROJECT_ID=shine-ae3df
ADMIN_EMAIL=anuragdube30@gmail.com
ADMIN_PASSWORD=your_initial_admin_password
```

Initialize the administrator account (safe to run; preserves existing records):

```bash
npm run admin:setup
```

Start the backend:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
```

Configure `frontend/.env` (see `frontend/.env.example`):

- `VITE_FIREBASE_*` — already configured for `shine-ae3df`
- `VITE_APPWRITE_URL`, `VITE_APPWRITE_PROJECT_ID`, `VITE_APPWRITE_STORAGE_ID` — add your Appwrite Storage values to enable featured image uploads

Start the frontend:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Key Routes

- Public: `/`, `/category/:slug` (`blog`, `television`, `digital`, `movies`, `stories`, `podcasts`), `/contact`, `/about`, `/search`, `/post/:postSlug`, `/sign-in`, `/sign-up`
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/create-post`, `/admin/posts`, `/admin/users`, `/admin/comments`, `/admin/settings`
