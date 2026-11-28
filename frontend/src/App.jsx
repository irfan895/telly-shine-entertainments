import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { MotionConfig } from "framer-motion"
import SignInForm from "./auth/forms/SignInForm"
import SignUpForm from "./auth/forms/SignUpForm"
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import CategoryPage from "./pages/CategoryPage"
import Dashboard from "./pages/Dashboard"
import Header from "./components/shared/Header"
import { Toaster } from "./components/ui/toaster"
import Footer from "./components/shared/Footer"
import PrivateRoute from "./components/shared/PrivateRoute"
import CreatePost from "./pages/CreatePost"
import AdminPrivateRoute from "./components/shared/AdminPrivateRoute"
import EditPost from "./pages/EditPost"
import PostDetails from "./pages/PostDetails"
import ScrollToTop from "./components/shared/ScrollToTop"
import Search from "./pages/Search"
import AdminLogin from "./pages/AdminLogin"
import AdminLayout from "./components/shared/AdminLayout"
import MainDashboard from "./components/shared/MainDashboard"
import DashboardPosts from "./components/shared/DashboardPosts "
import DashboardUsers from "./components/shared/DashboardUsers"
import DashboardComments from "./components/shared/DashboardComments"
import AdminSettingsPage from "./pages/AdminSettingsPage"
import ForgotPassword from "./pages/ForgotPassword"
import DashboardCategories from "./components/shared/DashboardCategories"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import Terms from "./pages/Terms"
import NotFound from "./pages/NotFound"

const App = () => {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
      <Header />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/news" element={<Search />} />
        <Route path="/post/:postSlug" element={<PostDetails />} />

        {/* Auth Routes */}
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected User Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminPrivateRoute />}>
          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout title="Dashboard Overview">
                <MainDashboard />
              </AdminLayout>
            }
          />
          <Route path="/admin/create-post" element={<CreatePost />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<EditPost />} />
          <Route path="/admin/edit-post/:postId" element={<EditPost />} />
          <Route
            path="/admin/posts"
            element={
              <AdminLayout title="Manage Articles">
                <DashboardPosts />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminLayout title="Manage Categories">
                <DashboardCategories />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminLayout title="User Management">
                <DashboardUsers />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/comments"
            element={
              <AdminLayout title="Comment Moderation">
                <DashboardComments />
              </AdminLayout>
            }
          />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <Toaster />
    </BrowserRouter>
    </MotionConfig>
  )
}

export default App
