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
import {
  Users,
  CheckCircle2,
  FileEdit,
  MessageSquare,
  Tags,
  Eye,
  Star,
  Flame,
} from "lucide-react"

const MainDashboard = () => {
  const [users, setUsers] = useState([])
  const [, setComments] = useState([])
  const [posts, setPosts] = useState([])
  const [activityLogs, setActivityLogs] = useState([])

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    featuredPosts: 0,
    trendingPosts: 0,
    totalCategories: 0,
    totalComments: 0,
    totalViews: 0,
  })

  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    if (!currentUser?.isAdmin) return

    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes, usersRes, postsRes, commentsRes] = await Promise.all([
          fetch("/api/admin/stats", { credentials: "include" }),
          fetch("/api/admin/activity?limit=10", { credentials: "include" }),
          fetch("/api/user/getusers?limit=5", { credentials: "include" }),
          fetch("/api/post/getposts?limit=5&includeDrafts=true", { credentials: "include" }),
          fetch("/api/comment/getcomments?limit=5", { credentials: "include" }),
        ])

        const [statsData, activityData, usersData, postsData, commentsData] =
          await Promise.all([
            statsRes.json(),
            activityRes.json(),
            usersRes.json(),
            postsRes.json(),
            commentsRes.json(),
          ])

        if (statsRes.ok) setStats(statsData)
        if (activityRes.ok) setActivityLogs(activityData.logs || [])
        if (usersRes.ok) setUsers(usersData.users || [])
        if (postsRes.ok) setPosts(postsData.posts || [])
        if (commentsRes.ok) setComments(commentsData.comments || [])
      } catch (error) {
        console.error("Failed to load dashboard stats:", error)
      }
    }

    fetchDashboardData()
  }, [currentUser])

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, Icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Published Articles", value: stats.publishedPosts, Icon: CheckCircle2, color: "text-green-600 bg-green-50" },
    { label: "Draft Articles", value: stats.draftPosts, Icon: FileEdit, color: "text-amber-600 bg-amber-50" },
    { label: "Categories", value: stats.totalCategories, Icon: Tags, color: "text-indigo-600 bg-indigo-50" },
    { label: "Total Views", value: stats.totalViews, Icon: Eye, color: "text-cyan-600 bg-cyan-50" },
    { label: "Featured", value: stats.featuredPosts, Icon: Star, color: "text-yellow-600 bg-yellow-50" },
    { label: "Trending", value: stats.trendingPosts, Icon: Flame, color: "text-purple-600 bg-purple-50" },
    { label: "Comments", value: stats.totalComments, Icon: MessageSquare, color: "text-red-600 bg-red-50" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(({ label, value, Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {label}
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
            </div>
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-slate-900">Recent Articles</h2>
            <Link to="/admin/posts">
              <Button variant="outline" size="sm">Manage All</Button>
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
                      <Link to={`/post/${post.slug}`} className="hover:text-red-600 hover:underline">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-slate-900">Recent Users</h2>
            <Link to="/admin/users">
              <Button variant="outline" size="sm">See All</Button>
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
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          user.isAdmin ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
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

      {/* Latest Activity Logs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-slate-900">Latest Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell className="text-xs text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-800">{log.action}</TableCell>
                    <TableCell className="text-xs text-slate-600 max-w-md truncate">
                      {log.details || log.actorEmail}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-xs text-slate-500 py-6">
                    No activity recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default MainDashboard
