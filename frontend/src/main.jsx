import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { Provider } from "react-redux"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"

const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")

if (apiBaseUrl) {
  const originalFetch = window.fetch.bind(window)
  window.fetch = (input, init = {}) => {
    if (typeof input === "string" && input.startsWith("/api")) {
      return originalFetch(`${apiBaseUrl}${input}`, {
        credentials: "include",
        ...init,
      })
    }
    return originalFetch(input, init)
  }
}

createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <App />
    </Provider>
  </PersistGate>
)
