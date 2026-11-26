import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import ErrorBoundary from "./components/shared/ErrorBoundary.jsx"
import { Provider } from "react-redux"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"

const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")

const originalFetch = window.fetch.bind(window)
window.fetch = (input, init = {}) => {
  if (typeof input === "string" && input.startsWith("/api")) {
    const token = localStorage.getItem("ts_auth_token")
    const headers = new Headers(init.headers || {})
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    const targetUrl = apiBaseUrl ? `${apiBaseUrl}${input}` : input
    return originalFetch(targetUrl, {
      credentials: "include",
      ...init,
      headers,
    })
  }
  return originalFetch(input, init)
}

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <App />
      </Provider>
    </PersistGate>
  </ErrorBoundary>
)
