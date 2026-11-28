import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Render error caught by ErrorBoundary:", {
      name: error?.name,
      message: error?.message,
      componentStack: errorInfo?.componentStack?.split("\n").slice(0, 4).join("\n"),
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.inline) {
        return (
          <div className="rounded-sm border border-stone bg-ivory-light p-6 text-center text-sm text-ink-muted">
            <p className="font-serif text-base font-bold text-charcoal">
              {this.props.fallbackTitle || "Unable to display this section"}
            </p>
            <p className="mt-1 text-xs">
              Some story data could not be rendered cleanly.
            </p>
          </div>
        )
      }

      return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-sm border border-stone bg-ivory-light p-8 text-center shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-burgundy">
              Telly Shine Entertainment
            </p>
            <h1 className="mt-2 font-serif text-2xl font-bold text-charcoal">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-ink-muted">
              We encountered an unexpected error while rendering this page.
            </p>
            {this.state.error?.message && (
              <p className="mt-3 text-xs text-burgundy break-words bg-ivory p-3 rounded-sm border border-stone">
                {this.state.error.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center rounded-sm bg-burgundy px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-ivory hover:bg-burgundy-dark transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
