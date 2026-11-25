# Telly Shine Entertainment — Setup Guide

This ZIP contains the updated existing React/Vite + Express/MongoDB project. It is not a deployed website; it must be configured and run locally or on your hosting provider.

## 1. Configure the backend

1. Open the `backend` folder.
2. Copy `.env.example` and rename the copy to `.env`.
3. Set your MongoDB connection string in `MONGO_URI`.
4. Replace `JWT_SECRET` with a long random secret.
5. Set `ADMIN_EMAIL=anuragdube30@gmail.com`.
6. Set `ADMIN_PASSWORD` to the initial password you want to use. For security, use a unique password and change it after first login. Do not share or commit your `.env` file.

From a terminal:

```bash
cd backend
npm install
npm run admin:setup
npm run dev
```

`npm run admin:setup` creates the admin account if it does not exist. If the email already exists, it updates that account's password and grants it admin access. Run it only against the MongoDB database you intend to use.

## 2. Configure the frontend

The previous Firebase project values were removed. If you want Google sign-in, create/use a Firebase project you control and copy `frontend/.env.example` to `frontend/.env`, then fill in its Firebase web app values. Enable Google as a sign-in provider in Firebase Authentication.

If Firebase is not configured, email/password sign-in remains available and the Google sign-in button will explain that configuration is needed.

## 3. Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## 4. Admin access

- Admin email: `anuragdube30@gmail.com`
- Sign-in page: `/admin/login` (also `/sign-in`)
- Admin dashboard: `/dashboard?tab=dashboard`

The admin password is not embedded in this ZIP. Set it privately in `backend/.env` before running `npm run admin:setup`.

## 5. Social links

The header, homepage and footer use the YouTube, Instagram and Facebook links supplied for Telly Shine Entertainment.

## 6. Important notes

- Existing MongoDB articles, users and comments are preserved when you point the backend to the same database.
- Firebase Google authentication needs your own Firebase project configuration; this ZIP does not contain or transfer Firebase credentials.
- The application uses the existing Appwrite image upload configuration. If image upload is not already configured in your environment, inspect `frontend/src/lib/appwrite/config.js` and provide your own Appwrite project details.
- Before public deployment, use a strong unique admin password, HTTPS, a production JWT secret, and restrict database/network access.
