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
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useToast } from "@/hooks/use-toast"
import { FaCheck } from "react-icons/fa"
import { RxCross2 } from "react-icons/rx"

const DashboardUsers = () => {
  const { currentUser } = useSelector((state) => state.user)
  const { toast } = useToast()

  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showMore, setShowMore] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState("")

  const fetchUsers = async (startIndex = 0, append = false, search = searchTerm) => {
    try {
      const params = new URLSearchParams({
        startIndex: String(startIndex),
        limit: "12",
      })
      if (search.trim()) params.set("searchTerm", search.trim())

      const res = await fetch(`/api/user/getusers?${params.toString()}`, {
        credentials: "include",
      })
      const data = await res.json()

      if (res.ok) {
        const list = data.users || []
        setUsers((prev) => (append ? [...prev, ...list] : list))
        setShowMore(list.length === 12)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchUsers(0, false, "")
    }
  }, [currentUser?._id])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchUsers(0, false, searchTerm)
  }

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await res.json()

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userIdToDelete))
        toast({ title: "User deleted successfully." })
      } else {
        toast({
          title: "Cannot delete user",
          description: data.message || "Operation failed.",
        })
      }
    } catch (error) {
      toast({ title: "Error", description: error.message })
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-bold text-slate-900">Registered Users</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>

      {currentUser?.isAdmin && users.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Joined</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="text-xs text-slate-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-8 h-8 object-cover bg-gray-200 rounded-full"
                      />
                      <span className="font-medium text-sm">{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        user.isAdmin
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-600" />
                    ) : (
                      <RxCross2 className="text-slate-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setUserIdToDelete(user._id)}
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete user account?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {user.email}. The last remaining administrator cannot be deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteUser}
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
                onClick={() => fetchUsers(users.length, true)}
              >
                Show More
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500 py-8 text-center">No users found.</p>
      )}
    </div>
  )
}

export default DashboardUsers
