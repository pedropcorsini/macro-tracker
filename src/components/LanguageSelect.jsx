import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

const LANGUAGES = [
  { code: "pt", shortLabel: "PT", label: "Português" },
  { code: "en", shortLabel: "EN", label: "English" },
  { code: "es", shortLabel: "ES", label: "Español" },
]

function normalizeLanguage(language = "") {
  if (language.startsWith("en")) return "en"
  if (language.startsWith("es")) return "es"
  return "pt"
}

export default function LanguageSelect({ variant = "dark", fullWidth = false }) {
  const { i18n } = useTranslation()
  const containerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const currentLanguage = normalizeLanguage(i18n.language)
  const currentOption = LANGUAGES.find((language) => language.code === currentLanguage) || LANGUAGES[0]

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const wrapperClassName = [
    "language-select-wrap",
    `language-select-wrap--${variant}`,
    fullWidth ? "language-select-wrap--full" : "",
    isOpen ? "is-open" : "",
  ].filter(Boolean).join(" ")

  return (
    <div ref={containerRef} className={wrapperClassName}>
      <button
        type="button"
        aria-label="Selecionar idioma"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="language-select-trigger"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="language-select-value">{currentOption.shortLabel}</span>
        <svg className="language-select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="language-select-menu" role="listbox" aria-label="Idiomas disponíveis">
          {LANGUAGES.map((language) => {
            const isActive = language.code === currentLanguage

            return (
              <button
                key={language.code}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`language-select-option ${isActive ? "is-active" : ""}`}
                onClick={() => {
                  i18n.changeLanguage(language.code)
                  setIsOpen(false)
                }}
              >
                <span className="language-select-option-code">{language.shortLabel}</span>
                <span className="language-select-option-label">{language.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
