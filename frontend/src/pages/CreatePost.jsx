import AdminLayout from "@/components/shared/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  getFilePreview,
  isAppwriteConfigured,
  uploadFile,
  validateImageFile,
} from "@/lib/appwrite/uploadImage"
import React, { useMemo, useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useNavigate } from "react-router-dom"
import { Eye, ImagePlus, Trash2, UploadCloud } from "lucide-react"

const CATEGORIES = [
  { label: "Bollywood", value: "Bollywood" },
  { label: "Hollywood", value: "Hollywood" },
  { label: "TV & Television", value: "Television" },
  { label: "Digital", value: "Digital" },
  { label: "Movies", value: "Movies" },
  { label: "Stories", value: "Stories" },
  { label: "Blog", value: "Blog" },
  { label: "Podcasts", value: "Podcasts" },
]

const CreatePost = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [localPreview, setLocalPreview] = useState("")
  const [imageUploadError, setImageUploadError] = useState("")
  const [imageUploading, setImageUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    title: "",
    category: "Blog",
    description: "",
    tags: "",
    image: "",
    content: "",
    is_featured: false,
    is_trending: false,
    is_breaking: false,
  })

  const [submitting, setSubmitting] = useState(false)
  const [createPostError, setCreatePostError] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  )

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    setImageUploadError("")
    if (!selected) return

    try {
      validateImageFile(selected)
      setFile(selected)
      setLocalPreview(URL.createObjectURL(selected))
    } catch (err) {
      setFile(null)
      setLocalPreview("")
      setImageUploadError(err.message)
    }
  }

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please choose an image file first.")
        return
      }

      setImageUploading(true)
      setUploadProgress(15)
      setImageUploadError("")

      const uploadedFile = await uploadFile(file, setUploadProgress)
      const postImageUrl = getFilePreview(uploadedFile.$id)

      setFormData((prev) => ({ ...prev, image: postImageUrl }))
      toast({ title: "Featured image uploaded to Appwrite!" })
    } catch (error) {
      setImageUploadError(error.message || "Image upload failed.")
      setUploadProgress(0)
      toast({
        title: "Image Upload Failed",
        description: error.message,
      })
    } finally {
      setImageUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFile(null)
    setLocalPreview("")
    setUploadProgress(0)
    setImageUploadError("")
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const submitArticle = async (status) => {
    if (submitting) return
    setCreatePostError("")

    if (!formData.title.trim()) {
      setCreatePostError("Please enter an article headline.")
      return
    }
    if (!formData.category) {
      setCreatePostError("Please select a category.")
      return
    }
    const plainContent = formData.content.replace(/<[^>]*>/g, "").trim()
    if (!plainContent) {
      setCreatePostError("Please write the article content.")
      return
    }
    if (status === "published" && !formData.image) {
      setCreatePostError("Please upload a featured image before publishing.")
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, status }),
      })

      const data = await res.json()

      if (!res.ok) {
        const msg = data.message || "Failed to save article."
        setCreatePostError(msg)
        toast({ title: "Action Failed", description: msg })
        return
      }

      toast({
        title:
          status === "draft"
            ? "Draft Saved Successfully!"
            : "Article Published Successfully!",
      })
      navigate(status === "draft" ? "/admin/posts" : `/post/${data.slug}`)
    } catch (error) {
      setCreatePostError(error.message || "Something went wrong.")
      toast({ title: "Error", description: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const appwriteReady = isAppwriteConfigured()

  return (
    <AdminLayout title="Create New Article">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Column */}
        <div className="lg:col-span-2 space-y-5 bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-full sm:w-64 h-11 border-gray-300">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Article Title
            </label>
            <Input
              type="text"
              placeholder="Enter your article headline..."
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="h-12 text-base font-semibold border-gray-300"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Short Description (Optional)
            </label>
            <Textarea
              rows={2}
              placeholder="Brief summary shown on article cards and previews..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="border-gray-300"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Tags (Comma-separated, optional)
            </label>
            <Input
              type="text"
              placeholder="e.g. Bollywood, Box Office, Exclusive"
              value={formData.tags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              className="border-gray-300"
            />
          </div>

          {/* Featured Image Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Featured Image (JPG, JPEG, PNG, WebP • Max 5 MB)
              </label>
              {(formData.image || localPreview) && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Image
                </button>
              )}
            </div>

            {!appwriteReady && (
              <p className="mb-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Appwrite Storage is not configured in <code>frontend/.env</code> (missing{" "}
                <code>VITE_APPWRITE_URL</code>, <code>VITE_APPWRITE_PROJECT_ID</code>, or{" "}
                <code>VITE_APPWRITE_STORAGE_ID</code>). Image uploads will fail until configured.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
              <div className="flex items-center gap-2 min-w-0">
                <ImagePlus className="w-5 h-5 text-slate-500 shrink-0" />
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="border-0 bg-transparent p-0 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
                />
              </div>

              <Button
                type="button"
                onClick={handleUploadImage}
                disabled={imageUploading || !file}
                className="bg-slate-900 hover:bg-slate-800 text-white shrink-0"
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                {imageUploading ? `Uploading (${uploadProgress}%)` : "Upload Image"}
              </Button>
            </div>

            {imageUploading && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-green-600 h-1.5 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {imageUploadError && (
              <p className="text-xs text-red-600 mt-2 font-medium">{imageUploadError}</p>
            )}

            <div className="mt-3">
              <Input
                type="url"
                placeholder="Or paste a featured image URL (https://...)"
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                className="border-gray-300 text-sm"
              />
            </div>

            {(formData.image || localPreview) && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={formData.image || localPreview}
                  alt="Featured preview"
                  className="w-full h-64 object-cover"
                />
                {!formData.image && localPreview && (
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded">
                    Local preview — click &quot;Upload Image&quot; to upload to Appwrite
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Article Content
            </label>
            <div className="bg-white rounded-lg">
              <ReactQuill
                theme="snow"
                modules={quillModules}
                placeholder="Write your full story here..."
                value={formData.content}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                className="h-80 mb-14"
              />
            </div>
          </div>

          {createPostError && (
            <p className="text-sm text-red-600 font-medium">{createPostError}</p>
          )}
        </div>

        {/* Right Sidebar Options & Publish Actions (Reference Image 2) */}
        <aside className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Publishing Options</h2>

            <label className="flex items-center justify-between text-sm text-slate-700 cursor-pointer">
              <span>Feature on Homepage</span>
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))
                }
                className="h-4 w-4 accent-red-600"
              />
            </label>

            <label className="flex items-center justify-between text-sm text-slate-700 cursor-pointer">
              <span>Mark as Trending</span>
              <input
                type="checkbox"
                checked={formData.is_trending}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_trending: e.target.checked }))
                }
                className="h-4 w-4 accent-red-600"
              />
            </label>

            <label className="flex items-center justify-between text-sm text-slate-700 cursor-pointer">
              <span>Mark as Breaking News</span>
              <input
                type="checkbox"
                checked={formData.is_breaking}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_breaking: e.target.checked }))
                }
                className="h-4 w-4 accent-red-600"
              />
            </label>

            <div className="pt-2 border-t border-gray-100 text-xs text-slate-500">
              Visibility: <strong className="text-slate-800">Public when published</strong>
            </div>
          </div>

          {/* Mini Preview Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {(formData.image || localPreview) && (
                  <img
                    src={formData.image || localPreview}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-red-600 uppercase">
                  {formData.category}
                </p>
                <p className="text-sm font-bold text-slate-900 truncate">
                  {formData.title || "Untitled Article"}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview((p) => !p)}
              className="w-full mt-4"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              {showPreview ? "Hide Preview" : "Preview Article"}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => submitArticle("draft")}
              className="w-full h-11 font-semibold border-slate-300"
            >
              {submitting ? "Saving..." : "Save as Draft"}
            </Button>

            <Button
              type="button"
              disabled={submitting}
              onClick={() => submitArticle("published")}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold tracking-wide"
            >
              {submitting ? "Publishing..." : "PUBLISH YOUR ARTICLE"}
            </Button>
          </div>
        </aside>
      </div>

      {/* Article Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Preview • {formData.category}
              </span>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              {formData.title || "Untitled Article"}
            </h2>
            {formData.description && (
              <p className="mt-2 text-slate-600">{formData.description}</p>
            )}
            {(formData.image || localPreview) && (
              <img
                src={formData.image || localPreview}
                alt="Preview"
                className="mt-4 w-full max-h-80 object-cover rounded-xl"
              />
            )}
            <div
              className="mt-6 prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: formData.content || "<p>No content yet.</p>" }}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default CreatePost
