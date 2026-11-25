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
    console.error("Application render error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <h1 className="text-2xl font-black text-slate-950">
              Telly Shine Entertainment
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Something went wrong while rendering this page.
            </p>
            {this.state.error?.message && (
              <p className="mt-2 text-xs text-red-600 break-words">
                {this.state.error.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
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
