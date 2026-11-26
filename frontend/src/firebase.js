import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

// Public Firebase Web App config for project shine-ae3df (env vars override defaults when provided)
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDpQR5jEEiTXGJFhLUJIzy_VQ1TDDN41WA",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "shine-ae3df.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "shine-ae3df",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "shine-ae3df.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "638823147718",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:638823147718:web:091d7c17389d4577b74fc7",
}

let app = null
let auth = null

try {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
  auth = getAuth(app)
} catch (error) {
  console.error("Firebase initialization failed:", error.message)
}

export { app, auth }
export default app
