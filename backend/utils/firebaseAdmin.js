import fs from "fs"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

let adminApp = null

export const getFirebaseAdminApp = () => {
  if (adminApp) return adminApp
  if (getApps().length > 0) {
    adminApp = getApps()[0]
    return adminApp
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || "shine-ae3df"

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || projectId,
    })
    return adminApp
  }

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (credPath && fs.existsSync(credPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(credPath, "utf8"))
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || projectId,
    })
    return adminApp
  }

  // Fallback: verifyIdToken validates Google public JWKS & projectId audience
  adminApp = initializeApp({ projectId })
  return adminApp
}

export const verifyFirebaseIdToken = async (idToken) => {
  const app = getFirebaseAdminApp()
  return getAuth(app).verifyIdToken(idToken)
}
