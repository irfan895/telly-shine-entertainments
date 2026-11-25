import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found | Telly Shine Entertainment"
  }, [])

  return (
    <main className="min-h-[70vh] bg-white flex items-center justify-center px-4 py-20">
      <div className="max-w-md text-center">
        <p className="text-sm font-black uppercase tracking-widest text-red-600">404 Error</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Page Not Found</h1>
        <p className="mt-3 text-slate-600">
          The page or story you are looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white">Go to Homepage</Button>
          </Link>
          <Link to="/news">
            <Button variant="outline">Browse Latest News</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NotFound
