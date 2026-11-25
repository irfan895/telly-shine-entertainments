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
  uploadFile,
  validateImageFile,
} from "@/lib/appwrite/uploadImage"
import React, { useEffect, useMemo, useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

const CATEGORIES = ["Bollywood", "Hollywood", "Television", "Digital", "Movies", "Stories", "Blog", "Podcasts"]

const EditPost = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { postId } = useParams()
  const { currentUser } = useSelector((state) => state.user)

  const [file, setFile] = useState(null)
  const [imageUploadError, setImageUploadError] = useState("")
  const [imageUploading, setImageUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [updatePostError, setUpdatePostError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    category: "Blog",
    description: "",
    image: "",
    content: "",
    status: "published",
    is_featured: false,
    is_trending: false,
  })

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts?postId=${postId}&includeDrafts=true`,
          { credentials: "include" }
        )
        const data = await res.json()

        if (!res.ok || !data.posts?.length) {
          setUpdatePostError(data.message || "Article not found.")
          return
        }

        const p = data.posts[0]
        setFormData({
          title: p.title || "",
          category: p.category || "Blog",
          description: p.description || p.excerpt || "",
          image: p.image || p.featured_image || "",
          content: p.content || "",
          status: p.status || "published",
          is_featured: Boolean(p.is_featured),
          is_trending: Boolean(p.is_trending),
        })
      } catch (error) {
        setUpdatePostError(error.message)
      }
    }

    fetchPost()
  }, [postId])

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    setImageUploadError("")
    if (!selected) return

    try {
      validateImageFile(selected)
      setFile(selected)
    } catch (err) {
      setFile(null)
      setImageUploadError(err.message)
    }
  }

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image!")
        return
      }
      setImageUploading(true)
      setImageUploadError("")

      const uploadedFile = await uploadFile(file)
      const postImageUrl = getFilePreview(uploadedFile.$id)
      setFormData((prev) => ({ ...prev, image: postImageUrl }))
      toast({ title: "Image Uploaded Successfully!" })
    } catch (error) {
      setImageUploadError(error.message || "Image upload failed")
      toast({ title: "Image upload failed!", description: error.message })
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    try {
      setSubmitting(true)
      setUpdatePostError("")

      const res = await fetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setUpdatePostError(data.message || "Update failed.")
        toast({ title: "Update failed", description: data.message })
        return
      }

      toast({ title: "Article Updated Successfully!" })
      navigate(data.status === "draft" ? "/admin/posts" : `/post/${data.slug}`)
    } catch (error) {
      setUpdatePostError(error.message)
      toast({ title: "Something went wrong!", description: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout title="Edit Article">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Article Title
              </label>
              <Input
                type="text"
                placeholder="Enter your article headline..."
                required
                className="h-11"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Short Description
            </label>
            <Textarea
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-2 border-dashed border-gray-300 rounded-xl p-4">
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              onClick={handleUploadImage}
              disabled={imageUploading || !file}
              className="bg-slate-900 text-white shrink-0"
            >
              {imageUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>

          {imageUploadError && (
            <p className="text-xs text-red-600">{imageUploadError}</p>
          )}

          <Input
            type="url"
            placeholder="Or paste a featured image URL (https://...)"
            value={formData.image}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, image: e.target.value }))
            }
            className="border-gray-300 text-sm"
          />

          {formData.image && (
            <img
              src={formData.image}
              alt="Featured"
              className="w-full h-64 object-cover rounded-xl"
            />
          )}

          <div>
            <ReactQuill
              theme="snow"
              modules={quillModules}
              placeholder="Write your article..."
              className="h-72 mb-14"
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, content: value }))
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))
                }
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_trending}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_trending: e.target.checked }))
                }
              />
              Trending
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="h-9 rounded-md border border-gray-300 px-3"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="h-12 bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            {submitting ? "Updating..." : "UPDATE ARTICLE"}
          </Button>

          {updatePostError && (
            <p className="text-red-600 text-sm">{updatePostError}</p>
          )}
        </form>
      </div>
    </AdminLayout>
  )
}

export default EditPost
