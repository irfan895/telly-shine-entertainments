import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Users, FileText, CheckCircle2, FileEdit, MessageSquare } from "lucide-react"

const MainDashboard = () => {
  const [users, setUsers] = useState([])
  const [comments, setComments] = useState([])
  const [posts, setPosts] = useState([])

  const [stats, setStats] = useState({
    totalUsers: 0,
    lastMonthUsers: 0,
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    lastMonthPosts: 0,
    totalComments: 0,
    lastMonthComments: 0,
  })

  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    if (!currentUser?.isAdmin) return

    const fetchDashboardData = async () => {
      try {
        const [usersRes, postsRes, commentsRes] = await Promise.all([
          fetch("/api/user/getusers?limit=5", { credentials: "include" }),
          fetch("/api/post/getposts?limit=5&includeDrafts=true", { credentials: "include" }),
          fetch("/api/comment/getcomments?limit=5", { credentials: "include" }),
        ])

        const [usersData, postsData, commentsData] = await Promise.all([
          usersRes.json(),
          postsRes.json(),
          commentsRes.json(),
        ])

        if (usersRes.ok) {
          setUsers(usersData.users || [])
        }
        if (postsRes.ok) {
          setPosts(postsData.posts || [])
        }
        if (commentsRes.ok) {
          setComments(commentsData.comments || [])
        }

        setStats({
          totalUsers: usersData.totalUsers || 0,
          lastMonthUsers: usersData.lastMonthUsers || 0,
          totalPosts: postsData.totalPosts || 0,
          publishedPosts: postsData.publishedPosts || 0,
          draftPosts: postsData.draftPosts || 0,
          lastMonthPosts: postsData.lastMonthPosts || 0,
          totalComments: commentsData.totalComments || 0,
          lastMonthComments: commentsData.lastMonthComments || 0,
        })
      } catch (error) {
        console.error("Failed to load dashboard stats:", error)
      }
    }

    fetchDashboardData()
  }, [currentUser])

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      sub: `+${stats.lastMonthUsers} last 30 days`,
      Icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Total Articles",
      value: stats.totalPosts,
      sub: `+${stats.lastMonthPosts} last 30 days`,
      Icon: FileText,
      color: "text-slate-800 bg-slate-100",
    },
    {
      label: "Published Articles",
      value: stats.publishedPosts,
      sub: "Live on website",
      Icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Draft Articles",
      value: stats.draftPosts,
      sub: "Private drafts",
      Icon: FileEdit,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Total Comments",
      value: stats.totalComments,
      sub: `+${stats.lastMonthComments} last 30 days`,
      Icon: MessageSquare,
      color: "text-red-600 bg-red-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {statCards.map(({ label, value, sub, Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
              </p>
              <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{sub}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-slate-900">Recent Articles</h2>
            <Link to="/admin/posts">
              <Button variant="outline" size="sm">
                Manage All
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      <Link
                        to={`/post/${post.slug}`}
                        className="hover:text-red-600 hover:underline"
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${post.status === "draft"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                          }`}
                      >
                        {post.status || "published"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-slate-900">Recent Users</h2>
            <Link to="/admin/users">
              <Button variant="outline" size="sm">
                See All
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="flex items-center gap-2">
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-7 h-7 rounded-full object-cover bg-gray-200"
                      />
                      <span className="font-medium">{user.username}</span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${user.isAdmin
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Recent Comments */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-slate-900">Recent Comments</h2>
          <Link to="/admin/comments">
            <Button variant="outline" size="sm">
              Moderate All
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Likes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment._id}>
                  <TableCell className="max-w-md truncate">{comment.content}</TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {comment.user_name || comment.userId}
                  </TableCell>
                  <TableCell>{comment.numberOfLikes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default MainDashboard
