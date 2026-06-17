import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"

const ThemeContext = createContext(null)
const TEMA_STORAGE_KEY = "tema"
const TEMA_MANUAL_STORAGE_KEY = "tema_manual"

function getInitialTheme() {
  if (typeof window === "undefined") return "dark"

  try {
    const temaManual = window.localStorage.getItem(TEMA_MANUAL_STORAGE_KEY) === "true"
    const temaSalvo = window.localStorage.getItem(TEMA_STORAGE_KEY)
    if (temaManual && (temaSalvo === "dark" || temaSalvo === "light")) return temaSalvo
  } catch {
    // Ignore storage access errors and fall back to the default theme.
  }

  return "dark"
}

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(getInitialTheme)
  const [alternandoTema, setAlternandoTema] = useState(false)
  const bloqueioToggleRef = useRef(null)

  useLayoutEffect(() => {
    const root = document.documentElement

    root.classList.toggle("dark", tema === "dark")
    root.dataset.theme = tema
    root.style.colorScheme = tema

    try {
      window.localStorage.setItem(TEMA_STORAGE_KEY, tema)
    } catch {
      // Ignore storage access errors and keep the selected theme in memory.
    }
  }, [tema])

  function alternarTema() {
    if (bloqueioToggleRef.current) return

    setAlternandoTema(true)
    try {
      window.localStorage.setItem(TEMA_MANUAL_STORAGE_KEY, "true")
    } catch {
      // Ignore storage access errors and keep the selected theme in memory.
    }
    setTema((t) => (t === "dark" ? "light" : "dark"))

    bloqueioToggleRef.current = window.setTimeout(() => {
      bloqueioToggleRef.current = null
      setAlternandoTema(false)
    }, 220)
  }

  useEffect(() => {
    return () => {
      if (bloqueioToggleRef.current) {
        window.clearTimeout(bloqueioToggleRef.current)
      }
    }
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        tema,
        isDark: tema === "dark",
        alternandoTema,
        alternarTema,
        definirTema: setTema,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTema() {
  return useContext(ThemeContext)
}
