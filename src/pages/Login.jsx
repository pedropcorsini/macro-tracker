import { useState } from "react"
import { supabase } from "../services/supabase"
import { useTema } from "../context/ThemeContext"
import { useTranslation } from "react-i18next"
import "../styles/app.css"

const MODO = { LOGIN: "login", CADASTRO: "cadastro" }

function Login({ onVoltar, modo }) {
  const { t, i18n } = useTranslation()
  const { tema, alternarTema } = useTema()
  const [modoAtivo, setModoAtivo] = useState(modo === "cadastro" ? MODO.CADASTRO : MODO.LOGIN)
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  const d = tema === "dark"

  async function handleEmailSenha() {
    setErro("")
    setSucesso("")

    if (!email || !senha) {
      setErro(t("login_fill_fields"))
      return
    }

    setCarregando(true)
    try {
      if (modoAtivo === MODO.LOGIN) {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password: senha })
        if (error) throw error
        setSucesso(t("login_success"))
      }
    } catch (e) {
      setErro(e.message || "Ocorreu um erro.")
    } finally {
      setCarregando(false)
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    })
  }

  async function handleGitHub() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin },
    })
  }

  const destaques = [
    t("nav_today"),
    t("nav_calendar"),
    t("daily_goals"),
    t("nav_favorites"),
  ]

  return (
    <div className="app-shell auth-shell">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      <div className="auth-layout">
        <section className="auth-panel auth-intro-panel">
          <div>
            <div className="auth-brand">
              <div className="auth-brand-dots">
                <span className="auth-brand-dot violet" />
                <span className="auth-brand-dot emerald" />
                <span className="auth-brand-dot rose" />
              </div>
              <div>
                <h1 className="auth-brand-title">Macro Tracker</h1>
                <p className="auth-brand-subtitle">{t("app_subtitle")}</p>
              </div>
            </div>

            <div className="page-tag">{modoAtivo === MODO.LOGIN ? t("login_enter") : t("login_register")}</div>
            <h2 className={d ? "page-title" : "page-title light"}>{t("app_name")}</h2>
            <p className="page-sub auth-intro-copy">{t("app_tagline")}</p>
          </div>

          <div className="auth-highlight-grid">
            {destaques.map((item) => (
              <div key={item} className="auth-highlight-card">
                <span className="auth-highlight-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="auth-panel auth-form-panel">
          <div className="auth-toolbar">
            {onVoltar ? (
              <button className={d ? "app-btn-secondary auth-back-btn" : "app-btn-secondary light auth-back-btn"} onClick={onVoltar}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Voltar
              </button>
            ) : <div />}

            <div className="auth-toolbar-actions">
              <button
                onClick={alternarTema}
                className={d ? "app-btn-secondary auth-theme-btn" : "app-btn-secondary light auth-theme-btn"}
              >
                {tema === "dark" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              <div className="auth-language-group">
                {[{ code: "pt", label: "PT" }, { code: "en", label: "EN" }, { code: "es", label: "ES" }].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`pill-tab${!d ? " light" : ""}${i18n.language.startsWith(lang.code) ? " active" : ""}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="auth-form-head">
            <h3 className={d ? "auth-form-title" : "auth-form-title light"}>
              {modoAtivo === MODO.LOGIN ? t("login_enter") : t("login_register")}
            </h3>
            <p className="auth-form-subtitle">{t("app_subtitle")}</p>
          </div>

          <div className="pill-tabs auth-mode-tabs">
            {[MODO.LOGIN, MODO.CADASTRO].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setModoAtivo(m)
                  setErro("")
                  setSucesso("")
                }}
                className={`pill-tab auth-mode-tab${!d ? " light" : ""}${modoAtivo === m ? " active" : ""}`}
              >
                {m === MODO.LOGIN ? t("login_enter") : t("login_register")}
              </button>
            ))}
          </div>

          <div className="auth-field-group">
            <div>
              <label className="auth-field-label">{t("login_email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSenha()}
                placeholder={t("login_email_placeholder")}
                className={d ? "app-input" : "app-input light"}
              />
            </div>

            <div>
              <label className="auth-field-label">{t("login_password")}</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSenha()}
                placeholder={t("login_password_placeholder")}
                className={d ? "app-input" : "app-input light"}
              />
            </div>
          </div>

          {erro && (
            <div className="auth-alert error">
              <p>{erro}</p>
            </div>
          )}

          {sucesso && (
            <div className="auth-alert success">
              <p>{sucesso}</p>
            </div>
          )}

          <button onClick={handleEmailSenha} disabled={carregando} className="app-btn-primary auth-submit-btn">
            {carregando ? t("login_loading") : modoAtivo === MODO.LOGIN ? t("login_enter") : t("login_register")}
          </button>

          <div className="auth-divider">
            <span>{t("login_or")}</span>
          </div>

          <div className="auth-social-grid">
            <button onClick={handleGoogle} className="auth-social-btn">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </button>

            <button onClick={handleGitHub} className="auth-social-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
