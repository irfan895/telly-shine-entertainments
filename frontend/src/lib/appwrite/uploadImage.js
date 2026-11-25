import { ID, ImageGravity } from "appwrite"
import { appwriteConfig, storage } from "./config"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export function isAppwriteConfigured() {
  return Boolean(
    appwriteConfig.url && appwriteConfig.projectId && appwriteConfig.storageId
  )
}

export function validateImageFile(file) {
  if (!file) {
    throw new Error("Please select an image file.")
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, JPEG, PNG, and WebP images are supported.")
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Image size must be 5 MB or less.")
  }
}

export async function uploadFile(file, onProgress) {
  validateImageFile(file)

  if (!isAppwriteConfigured()) {
    throw new Error(
      "Appwrite Storage is not configured. Set VITE_APPWRITE_URL, VITE_APPWRITE_PROJECT_ID, and VITE_APPWRITE_STORAGE_ID in frontend/.env."
    )
  }

  if (onProgress) onProgress(30)

  const uploadedFile = await storage.createFile(
    appwriteConfig.storageId,
    ID.unique(),
    file
  )

  if (!uploadedFile?.$id) {
    throw new Error("Appwrite upload did not return a file ID.")
  }

  if (onProgress) onProgress(100)
  return uploadedFile
}

export function getFilePreview(fileId) {
  if (!isAppwriteConfigured()) {
    throw new Error("Appwrite Storage is not configured.")
  }

  const fileUrl = storage.getFilePreview(
    appwriteConfig.storageId,
    fileId,
    1600,
    900,
    ImageGravity.Center,
    90
  )

  if (!fileUrl) {
    throw new Error("Unable to generate image preview URL.")
  }

  return typeof fileUrl === "string" ? fileUrl : fileUrl.toString()
}
