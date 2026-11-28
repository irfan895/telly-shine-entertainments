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

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = () => reject(new Error("Failed to read image file."))
    reader.readAsDataURL(file)
  })

export async function uploadFile(file, onProgress) {
  validateImageFile(file)

  if (!isAppwriteConfigured()) {
    if (onProgress) onProgress(30)
    const dataBase64 = await fileToBase64(file)
    if (onProgress) onProgress(65)

    const res = await fetch("/api/post/upload-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        dataBase64,
      }),
    })

    const data = await res.json()
    if (!res.ok || !data.url) {
      throw new Error(data.message || "Image upload failed.")
    }

    const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")
    const resolvedUrl = apiBaseUrl ? `${apiBaseUrl}${data.url}` : data.url

    if (onProgress) onProgress(100)
    return { $id: resolvedUrl, url: resolvedUrl }
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

export function getFilePreview(fileIdOrUrl) {
  if (!fileIdOrUrl) {
    throw new Error("Unable to generate image preview URL.")
  }

  if (
    typeof fileIdOrUrl === "string" &&
    (fileIdOrUrl.startsWith("http://") ||
      fileIdOrUrl.startsWith("https://") ||
      fileIdOrUrl.startsWith("/api/"))
  ) {
    return fileIdOrUrl
  }

  if (!isAppwriteConfigured()) {
    throw new Error("Appwrite Storage is not configured.")
  }

  const fileUrl = storage.getFilePreview(
    appwriteConfig.storageId,
    fileIdOrUrl,
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
