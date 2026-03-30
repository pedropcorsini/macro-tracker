import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { TrackerProvider } from "./context/TrackerContext"
import "./index.css"
import App from "./App.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TrackerProvider>
      <App />
    </TrackerProvider>
  </StrictMode>
)