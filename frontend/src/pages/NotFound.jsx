import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/editorial/MotionPrimitives"

const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found | Telly Shine Entertainment"
  }, [])

  return (
    <PageTransition>
      <main className="min-h-[75vh] bg-ivory flex items-center justify-center px-4 py-20">
        <div className="max-w-md text-center bg-ivory-light border border-stone rounded-sm p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-burgundy">
            404 Error
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-charcoal">
            Page Not Found
          </h1>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            The page or story you are looking for doesn&apos;t exist or may have been moved.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link to="/">
              <Button className="bg-burgundy hover:bg-burgundy-dark text-ivory rounded-sm text-xs uppercase tracking-wider font-semibold">
                Go to Homepage
              </Button>
            </Link>
            <Link to="/news">
              <Button
                variant="outline"
                className="border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory rounded-sm text-xs uppercase tracking-wider font-semibold"
              >
                Latest News
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  )
}

export default NotFound
