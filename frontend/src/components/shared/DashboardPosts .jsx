import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useToast } from "@/hooks/use-toast"

const CATEGORIES = ["all", "bollywood", "hollywood", "television", "digital", "movies", "stories", "blog", "podcasts"]

const DashboardPosts = () => {
  const { currentUser } = useSelector((state) => state.user)
  const { toast } = useToast()

  const [posts, setPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showMore, setShowMore] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState("")
  const [syncing, setSyncing] = useState(false)

  const handleSyncNews = async () => {
    try {
      setSyncing(true)
      const res = await fetch("/api/post/sync-news", {
        method: "POST",
        credentials: "include",
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: `Synced ${data.inserted || 0} new entertainment articles!` })
        fetchPosts(0, false)
      } else {
        toast({ title: "Sync failed", description: data.message })
      }
    } catch (err) {
      toast({ title: "Sync error", description: err.message })
    } finally {
      setSyncing(false)
    }
  }

  const fetchPosts = async (startIndex = 0, append = false) => {
    try {
      const params = new URLSearchParams({
        includeDrafts: "true",
        startIndex: String(startIndex),
        limit: "12",
      })
      if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim())
      if (categoryFilter !== "all") params.set("category", categoryFilter)
      if (statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(`/api/post/getposts?${params.toString()}`, {
        credentials: "include",
      })
      const data = await res.json()

      if (res.ok) {
        const list = data.posts || []
        setPosts((prev) => (append ? [...prev, ...list] : list))
        setShowMore(list.length === 12)
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    }
  }

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchPosts(0, false)
    }
  }, [currentUser?._id, categoryFilter, statusFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPosts(0, false)
  }

  const handleToggleStatus = async (post) => {
    const nextStatus = post.status === "draft" ? "published" : "draft"
    try {
      const res = await fetch(
        `/api/post/updatepost/${post._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: nextStatus }),
        }
      )
      const data = await res.json()
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p._id === post._id ? data : p)))
        toast({
          title: nextStatus === "published" ? "Article Published" : "Moved to Drafts",
        })
      } else {
        toast({ title: "Update failed", description: data.message })
      }
    } catch (error) {
      toast({ title: "Error", description: error.message })
    }
  }

  const handleToggleFlag = async (post, field) => {
    try {
      const res = await fetch(
        `/api/post/updatepost/${post._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ [field]: !post[field] }),
        }
      )
      const data = await res.json()
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p._id === post._id ? data : p)))
        toast({ title: "Article updated" })
      }
    } catch (error) {
      toast({ title: "Error", description: error.message })
    }
  }

  const handleDeletePost = async () => {
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      )
      const data = await res.json()

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== postIdToDelete))
        toast({ title: "Article deleted." })
      } else {
        toast({ title: "Delete failed", description: data.message })
      }
    } catch (error) {
      toast({ title: "Error", description: error.message })
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <h2 className="text-lg font-bold text-slate-900">Manage Articles</h2>

        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 sm:w-60"
            />
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <Button
            type="button"
            variant="outline"
            disabled={syncing}
            onClick={handleSyncNews}
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            {syncing ? "Syncing..." : "Sync Latest News"}
          </Button>
        </div>
      </div>

      {currentUser?.isAdmin && posts.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell className="text-xs text-slate-600">
                    {new Date(post.updatedAt || post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <img
                      src={post.image || post.featured_image}
                      alt={post.title}
                      className="w-16 h-10 object-cover rounded bg-gray-100"
                    />
                  </TableCell>
                  <TableCell className="max-w-xs font-medium">
                    <Link
                      to={`/post/${post.slug}`}
                      className="hover:text-red-600 hover:underline line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{post.category}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        post.status === "draft"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {post.status || "published"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(post)}
                        className="text-blue-600 hover:underline"
                      >
                        {post.status === "draft" ? "Publish" : "Unpublish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleFlag(post, "is_featured")}
                        className={post.is_featured ? "text-amber-600 hover:underline" : "text-slate-400 hover:underline"}
                      >
                        {post.is_featured ? "Featured" : "Feature"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleFlag(post, "is_trending")}
                        className={post.is_trending ? "text-purple-600 hover:underline" : "text-slate-400 hover:underline"}
                      >
                        {post.is_trending ? "Trending" : "Trend"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleFlag(post, "is_breaking")}
                        className={post.is_breaking ? "text-red-600 hover:underline" : "text-slate-400 hover:underline"}
                      >
                        {post.is_breaking ? "Breaking" : "Break"}
                      </button>
                      <Link
                        to={`/update-post/${post._id}`}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            type="button"
                            onClick={() => setPostIdToDelete(post._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove &quot;{post.title}&quot; from MongoDB.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={handleDeletePost}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {showMore && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => fetchPosts(posts.length, true)}>
                Show More
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500 py-8 text-center">
          No articles match the current filter.
        </p>
      )}
    </div>
  )
}

export default DashboardPosts
