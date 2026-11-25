import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
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
import { Button } from "../ui/button"
import { useToast } from "@/hooks/use-toast"

const DashboardComments = () => {
  const { currentUser } = useSelector((state) => state.user)
  const { toast } = useToast()

  const [comments, setComments] = useState([])
  const [showMore, setShowMore] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState("")

  const fetchComments = async (startIndex = 0, append = false) => {
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}&limit=12`,
        { credentials: "include" }
      )
      const data = await res.json()

      if (res.ok) {
        const list = data.comments || []
        setComments((prev) => (append ? [...prev, ...list] : list))
        setShowMore(list.length === 12)
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    }
  }

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchComments(0, false)
    }
  }, [currentUser?._id])

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      )
      const data = await res.json()

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete))
        toast({ title: "Comment deleted." })
      } else {
        toast({
          title: "Delete failed",
          description: data.message || "Could not delete comment.",
        })
      }
    } catch (error) {
      toast({ title: "Error", description: error.message })
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-5">
        Comment Moderation
      </h2>

      {currentUser?.isAdmin && comments.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {comments.map((comment) => (
                <TableRow key={comment._id}>
                  <TableCell className="text-xs text-slate-600">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <p className="line-clamp-2 text-sm">{comment.content}</p>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {comment.user_name || comment.userId}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 max-w-[160px] truncate">
                    {comment.article_slug || comment.postId}
                  </TableCell>
                  <TableCell>{comment.numberOfLikes}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setCommentIdToDelete(comment._id)}
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteComment}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {showMore && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => fetchComments(comments.length, true)}
              >
                Show More
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500 py-8 text-center">No comments yet.</p>
      )}
    </div>
  )
}

export default DashboardComments
