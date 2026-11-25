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

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!name.trim() || submitting) return

    try {
      setSubmitting(true)
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast({ title: "Could not create category", description: data.message })
        return
      }

      setName("")
      setDescription("")
      toast({ title: "Category added!" })
      fetchCategories()
    } catch (error) {
      toast({ title: "Error", description: error.message })
    } finally {
      setSubmitting(false)
    }
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
        <h2 className="text-lg font-bold text-slate-900 mb-4">Add Category</h2>
        <form onSubmit={handleAddCategory} className="grid sm:grid-cols-3 gap-3">
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
          <Button
            type="submit"
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {submitting ? "Adding..." : "Add Category"}
          </Button>
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
              <TableHead>Action</TableHead>
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
                    <button
                      type="button"
                      onClick={() => handleDelete(cat._id)}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
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
