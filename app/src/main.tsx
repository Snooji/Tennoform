import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App"

/* The existing app script runs first and exposes window.TF; the shell mounts around it. */
function mount() {
  const el = document.getElementById("tf-root")
  if (!el || !window.TF) return void setTimeout(mount, 30)
  document.documentElement.classList.add("tf-shell")
  createRoot(el).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
mount()
