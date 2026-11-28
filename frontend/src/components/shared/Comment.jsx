import moment from "moment"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { AiFillLike } from "react-icons/ai"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

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

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)

  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`)
        const data = await res.json()
        if (res.ok) {
          setUser(data)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    getUser()
  }, [comment])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(comment.content)
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      })

      if (res.ok) {
        setIsEditing(false)
        onEdit(comment, editedContent)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="flex py-4 text-sm gap-3">
      <div className="flex-shrink-0">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-9 h-9 rounded-sm object-cover bg-stone/40 border border-stone"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-xs text-charcoal truncate">
            {user?.username ? `@${user.username}` : "Reader"}
          </span>

          <span className="text-ink-muted text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              className="mb-2 bg-ivory border-stone rounded-sm"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />

            <div className="flex justify-end gap-2 text-sm">
              <Button
                type="button"
                className="bg-burgundy hover:bg-burgundy-dark text-ivory rounded-sm h-8 text-xs"
                onClick={handleSave}
              >
                Save
              </Button>

              <Button
                type="button"
                className="border-stone text-charcoal hover:border-burgundy hover:text-burgundy rounded-sm h-8 text-xs"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-soft-black pb-2 leading-relaxed">{comment.content}</p>

            <div className="flex items-center pt-1 text-xs gap-3 text-ink-muted">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`inline-flex items-center gap-1 transition-colors hover:text-burgundy ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "text-burgundy font-semibold"
                }`}
              >
                <AiFillLike className="text-sm" />
                {comment.numberOfLikes > 0 && (
                  <span>
                    {comment.numberOfLikes}{" "}
                    {comment.numberOfLikes === 1 ? "like" : "likes"}
                  </span>
                )}
              </button>

              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="hover:text-charcoal transition-colors"
                    >
                      Edit
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span className="hover:text-burgundy cursor-pointer transition-colors">
                          Delete
                        </span>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="bg-ivory-light border-stone">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-serif">
                            Delete this comment?
                          </AlertDialogTitle>

                          <AlertDialogDescription className="text-ink-muted">
                            This action cannot be undone. This will permanently
                            delete your comment from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-stone">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-burgundy hover:bg-burgundy-dark text-ivory"
                            onClick={() => onDelete(comment._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Comment
