import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { useToast } from "@/hooks/use-toast"
import Comment from "./Comment"

const CommentSection = ({ postId, articleId }) => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.user)
  const [comment, setComment] = useState("")
  const [allComments, setAllComments] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (comment.length > 200) {
      toast({
        title: "Comment length must be lower than or equal to 200 characters",
      })
      return
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({ title: "Comment posted!" })
        setComment("")
        setAllComments([data, ...allComments])
      }
    } catch (error) {
      console.log(error)
      toast({ title: "Something went wrong! Please try again." })
    }
  }

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(
          `/api/comment/getPostComments/${postId}?articleId=${encodeURIComponent(articleId || "")}`
        )

        if (res.ok) {
          const data = await res.json()
          setAllComments(data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    getComments()
  }, [postId])

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in")
        return
      }

      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      })

      if (res.ok) {
        const data = await res.json()
        setAllComments(
          allComments.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : c
          )
        )
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleEdit = async (editedComment, editedContent) => {
    setAllComments(
      allComments.map((c) =>
        c._id === editedComment._id ? { ...c, content: editedContent } : c
      )
    )
  }

  const handleDelete = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in")
        return
      }

      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        await res.json()
        setAllComments(allComments.filter((c) => c._id !== commentId))
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="w-full">
      <h2 className="font-serif text-2xl font-bold text-charcoal mb-4">
        Reader Discussion
      </h2>

      {currentUser ? (
        <div className="flex items-center gap-2 mb-4 text-ink-muted text-xs">
          <span>Signed in as</span>
          <img
            src={currentUser.profilePicture}
            alt="Profile Pic"
            className="h-5 w-5 object-cover rounded-sm"
          />
          <Link
            to="/dashboard?tab=profile"
            className="font-semibold text-burgundy hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-ink-muted my-4 p-4 rounded-sm border border-stone bg-ivory-light flex items-center gap-2">
          <span>You must be signed in to join the discussion.</span>
          <Link to="/sign-in" className="font-semibold text-burgundy hover:underline">
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          className="border border-stone bg-ivory-light rounded-sm p-4 mb-6"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Share your perspective..."
            rows="3"
            maxLength="200"
            className="bg-ivory border-stone rounded-sm focus-visible:ring-0 focus-visible:border-charcoal"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />

          <div className="flex justify-between items-center mt-4">
            <p className="text-ink-muted text-xs">
              {200 - comment.length} characters remaining
            </p>

            <Button
              type="submit"
              className="bg-burgundy hover:bg-burgundy-dark text-ivory rounded-sm text-xs uppercase tracking-wider font-semibold px-5 h-9"
            >
              Post Comment
            </Button>
          </div>
        </form>
      )}

      {allComments.length === 0 ? (
        <p className="text-sm text-ink-muted py-4">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <>
          <div className="text-xs uppercase tracking-wider my-5 flex items-center gap-2 font-semibold text-charcoal">
            <span>Comments</span>
            <span className="border border-stone bg-ivory-light py-0.5 px-2 rounded-sm text-burgundy">
              {allComments.length}
            </span>
          </div>

          <div className="divide-y divide-stone border-t border-stone">
            {allComments.map((c) => (
              <Comment
                key={c._id}
                comment={c}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default CommentSection
