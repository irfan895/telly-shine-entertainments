import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { signInFailure, signInStart, signInSuccess } from "@/redux/user/userSlice"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ShieldCheck } from "lucide-react"

const adminSchema = z.object({
  email: z.string().email({ message: "Enter a valid administrator email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

const AdminLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { loading, error } = useSelector((state) => state.user)

  const form = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values) => {
    try {
      dispatch(signInStart())

      const res = await fetch("/api/auth/admin/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok || data.success === false) {
        const msg = data.message || "Invalid administrator credentials."
        dispatch(signInFailure(msg))
        toast({ title: "Admin Login Failed", description: msg })
        return
      }

      dispatch(signInSuccess(data))

      if (data.mustChangePassword) {
        toast({
          title: "Signed in as Administrator",
          description: "Please update your initial password in Settings.",
        })
        navigate("/admin/settings")
      } else {
        toast({ title: "Welcome to Telly Shine Admin Panel" })
        navigate("/admin/dashboard")
      }
    } catch (err) {
      dispatch(signInFailure(err.message))
      toast({ title: "Login Error", description: err.message })
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <ShieldCheck className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Restricted Editorial Access
          </span>
        </div>

        <h1 className="text-2xl font-black text-slate-950">
          Telly Shine Admin Login
        </h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Sign in with your authorized administrator credentials.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@tellyshine.com"
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
                      placeholder="Enter administrator password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-11 font-semibold"
            >
              {loading ? "Verifying..." : "Sign In to Admin Panel"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-900 hover:underline">
            ← Return to Telly Shine Entertainment
          </Link>
        </div>
      </div>
    </main>
  )
}

export default AdminLogin
