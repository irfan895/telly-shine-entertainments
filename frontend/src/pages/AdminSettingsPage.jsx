import React from "react"
import AdminLayout from "@/components/shared/AdminLayout"
import DashboardProfile from "@/components/shared/DashboardProfile"
import { useSelector } from "react-redux"

const AdminSettingsPage = () => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <AdminLayout title="Admin Settings">
      {currentUser?.mustChangePassword && (
        <div className="max-w-lg mx-auto mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Security Notice:</strong> You are using the initial setup password. Please enter a new password below and click Update Profile.
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <DashboardProfile />
      </div>
    </AdminLayout>
  )
}

export default AdminSettingsPage
