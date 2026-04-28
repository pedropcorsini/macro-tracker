import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"

const ThemeContext = createContext(null)
const TEMA_STORAGE_KEY = "tema"

function getSystemTheme() {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function getInitialTheme() {
  if (typeof window === "undefined") return "light"

  try {
    const temaSalvo = window.localStorage.getItem(TEMA_STORAGE_KEY)
    if (temaSalvo === "dark" || temaSalvo === "light") return temaSalvo
  } catch {
    // Ignore storage access errors and fall back to the system theme.
  }

  return getSystemTheme()
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
