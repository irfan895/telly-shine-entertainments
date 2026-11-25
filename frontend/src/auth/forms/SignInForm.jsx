import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from "react-redux"
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "@/redux/user/userSlice"
import GoogleAuth from "@/components/shared/GoogleAuth"
import AuthLayout from "../AuthLayout"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
})

const SignInForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error: errorMessage } = useSelector((state) => state.user)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values) {
    try {
      dispatch(signInStart())

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok || data.success === false) {
        const msg = data.message || "Sign in failed. Please try again."
        dispatch(signInFailure(msg))
        toast({ title: "Sign in failed", description: msg })
        return
      }

      dispatch(signInSuccess(data))
      toast({ title: "Welcome back to Telly Shine Entertainment!" })
      navigate(data.isAdmin ? "/admin/dashboard" : "/")
    } catch (error) {
      dispatch(signInFailure(error.message))
      toast({ title: "Something went wrong!", description: error.message })
    }
  }

  return (
    <AuthLayout
      title="Sign In"
      description="Welcome back to Telly Shine Entertainment. Sign in to continue."
    >
      <div className="space-y-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <GoogleAuth />
          </form>
        </Form>

        <div className="flex justify-between text-sm text-slate-600">
          <span>
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="font-semibold text-red-600 hover:underline">
              Sign Up
            </Link>
          </span>
          <Link to="/admin/login" className="text-slate-500 hover:text-slate-900 hover:underline">
            Admin Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

export default SignInForm
