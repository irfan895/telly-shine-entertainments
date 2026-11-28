import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthLayout from "@/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const ForgotPassword = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleRequestCode = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    try {
      setLoading(true)
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok || data.success === false) {
        setError(data.message || "Unable to send reset code.")
        return
      }

      setMessage(data.message)
      setStep(2)
      toast({ title: "Reset code sent", description: data.message })
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError("")

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })
      const data = await res.json()

      if (!res.ok || data.success === false) {
        setError(data.message || "Failed to reset password.")
        return
      }

      toast({
        title: "Password Reset Successful",
        description: "You can now sign in with your new password.",
      })
      navigate("/sign-in")
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset Password"
      description={
        step === 1
          ? "Enter your account email to receive a password reset code."
          : "Enter the 6-digit code sent to your email and choose a new password."
      }
    >
      {step === 1 ? (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-burgundy">{error}</p>}
          {message && <p className="text-sm text-charcoal">{message}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy hover:bg-burgundy-dark text-ivory rounded-sm"
          >
            {loading ? "Sending Code..." : "Send Reset Code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              6-Digit Reset Code
            </label>
            <Input
              type="text"
              required
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <Input
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm New Password
            </label>
            <Input
              type="password"
              required
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-burgundy">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy hover:bg-burgundy-dark text-ivory rounded-sm"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}

      <div className="mt-5 text-center text-sm text-ink-muted">
        <Link to="/sign-in" className="text-burgundy font-semibold hover:underline">
          ← Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword
