import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth"
import { auth } from "@/firebase"
import { useDispatch } from "react-redux"
import { signInFailure, signInStart, signInSuccess } from "@/redux/user/userSlice"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const GoogleAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [googleLoading, setGoogleLoading] = useState(false)

  const exchangeFirebaseToken = async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken()
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ idToken }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || "Google sign-in failed")
    }

    dispatch(signInSuccess(data))
    toast({ title: `Welcome, ${data.username}!` })
    navigate(data.isAdmin ? "/admin/dashboard" : "/")
  }

  useEffect(() => {
    if (!auth) return
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setGoogleLoading(true)
          return exchangeFirebaseToken(result.user)
        }
      })
      .catch((error) => {
        console.error("Google redirect sign-in error:", error)
      })
      .finally(() => setGoogleLoading(false))
  }, [])

  const handleGoogleClick = async () => {
    if (!auth) {
      toast({
        title: "Google Sign-In Unavailable",
        description: "Please sign in using your email and password.",
      })
      return
    }

    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: "select_account" })

    try {
      setGoogleLoading(true)
      dispatch(signInStart())
      const firebaseResponse = await signInWithPopup(auth, provider)
      await exchangeFirebaseToken(firebaseResponse.user)
    } catch (error) {
      if (error.code === "auth/popup-blocked") {
        toast({
          title: "Popup Blocked",
          description: "Redirecting to Google Sign-In...",
        })
        await signInWithRedirect(auth, provider)
        return
      }
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        dispatch(signInFailure(null))
        toast({ title: "Google sign-in was cancelled." })
      } else if (error.code === "auth/unauthorized-domain") {
        const msg = `Domain "${window.location.hostname}" is not authorized in Firebase Console → Authentication → Settings → Authorized domains.`
        dispatch(signInFailure(msg))
        toast({ title: "Domain Not Authorized", description: msg })
      } else {
        console.error("Google authentication failed:", error)
        const msg = error.message || "Google sign-in failed. Please try again."
        dispatch(signInFailure(msg))
        toast({ title: "Google Sign-In Failed", description: msg })
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-slate-300 bg-white text-slate-900 hover:bg-slate-100 font-medium"
      onClick={handleGoogleClick}
      disabled={googleLoading}
    >
      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
        />
      </svg>
      {googleLoading ? "Connecting to Google..." : "Continue with Google"}
    </Button>
  )
}

export default GoogleAuth
