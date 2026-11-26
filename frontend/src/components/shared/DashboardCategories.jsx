import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { useToast } from "@/hooks/use-toast"

const DashboardCategories = () => {
  const { toast } = useToast()
  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category")
      const data = await res.json()
      if (res.ok) {
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmitCategory = async (e) => {
    e.preventDefault()
    if (!name.trim() || submitting) return

    try {
      setSubmitting(true)
      const url = editingId ? `/api/category/${editingId}` : "/api/category"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast({ title: "Operation failed", description: data.message })
        return
      }

      setName("")
      setDescription("")
      setEditingId(null)
      toast({ title: editingId ? "Category updated!" : "Category added!" })
      fetchCategories()
    } catch (error) {
      toast({ title: "Error", description: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (cat) => {
    setEditingId(cat._id)
    setName(cat.name)
    setDescription(cat.description || "")
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/category/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await res.json()

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id))
        toast({ title: "Category deleted." })
      } else {
        toast({ title: "Delete failed", description: data.message })
      }
    } catch (error) {
      toast({ title: "Error", description: error.message })
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          {editingId ? "Edit Category" : "Add Category"}
        </h2>
        <form onSubmit={handleSubmitCategory} className="grid sm:grid-cols-3 gap-3">
          <Input
            type="text"
            placeholder="Category name (e.g. Bollywood)"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Short description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {submitting ? "Saving..." : editingId ? "Update Category" : "Add Category"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null)
                  setName("")
                  setDescription("")
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm overflow-x-auto">
        <h2 className="text-lg font-bold text-slate-900 mb-4">All Categories</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {categories.map((cat) => (
              <TableRow key={cat._id || cat.slug}>
                <TableCell className="font-semibold">{cat.name}</TableCell>
                <TableCell className="text-xs text-slate-500">{cat.slug}</TableCell>
                <TableCell className="text-sm text-slate-600">{cat.description}</TableCell>
                <TableCell>
                  {cat._id ? (
                    <div className="flex gap-3 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => handleEdit(cat)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Default</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DashboardCategories
