import { useState } from "react"
import { supabase } from "../services/supabase"
import { useTranslation } from "react-i18next"

const MODO = { LOGIN: "login", CADASTRO: "cadastro" }

function Login() {
  const { t, i18n } = useTranslation()
  const [modo, setModo] = useState(MODO.LOGIN)
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  async function handleEmailSenha() {
    setErro(""); setSucesso("")
    if (!email || !senha) { setErro(t("login_fill_fields")); return }
    setCarregando(true)
    try {
      if (modo === MODO.LOGIN) {
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
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } })
  }

  async function handleGitHub() {
    await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: window.location.origin } })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] flex flex-col items-center justify-center px-4">

      {/* Seletor de idioma */}
      <div className="flex gap-2 mb-8">
        {[{ code: "pt", label: "PT" }, { code: "en", label: "EN" }, { code: "es", label: "ES" }].map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-wider border transition-all ${
              i18n.language.startsWith(lang.code)
                ? "bg-violet-500/20 text-violet-500 border-violet-500/30"
                : "text-gray-400 dark:text-zinc-600 border-gray-200 dark:border-[#2a2a2a] hover:text-gray-600"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-violet-500" />
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="w-2 h-2 rounded-full bg-rose-500" />
        </div>
        <h1 style={{ fontFamily: "'Bungee', cursive" }} className="text-lg tracking-widest text-gray-900 dark:text-white uppercase">
          Macro Tracker
        </h1>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="w-2 h-2 rounded-full bg-violet-500" />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-2xl p-8">

        {/* Abas */}
        <div className="flex mb-8 bg-gray-50 dark:bg-[#0f0f0f] rounded-xl p-1">
          {[MODO.LOGIN, MODO.CADASTRO].map((m) => (
            <button
              key={m}
              onClick={() => { setModo(m); setErro(""); setSucesso("") }}
              className={`flex-1 py-2 rounded-lg text-xs uppercase tracking-widest font-medium transition-all ${
                modo === m
                  ? "bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-white border border-gray-200 dark:border-[#2a2a2a]"
                  : "text-gray-400 dark:text-zinc-600 hover:text-gray-600"
              }`}
            >
              {m === MODO.LOGIN ? t("login_enter") : t("login_register")}
            </button>
          ))}
        </div>

        {/* Campos */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-widest block mb-1.5">{t("login_email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailSenha()}
              placeholder={t("login_email_placeholder")}
              className="w-full bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-zinc-200 placeholder-gray-300 dark:placeholder-zinc-700 outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-widest block mb-1.5">{t("login_password")}</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailSenha()}
              placeholder={t("login_password_placeholder")}
              className="w-full bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-zinc-200 placeholder-gray-300 dark:placeholder-zinc-700 outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-all"
            />
          </div>
        </div>

        {erro && (
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl px-4 py-2.5 mb-4">
            <p className="text-xs text-rose-500">{erro}</p>
          </div>
        )}
        {sucesso && (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-2.5 mb-4">
            <p className="text-xs text-emerald-500">{sucesso}</p>
          </div>
        )}

        <button
          onClick={handleEmailSenha}
          disabled={carregando}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium py-3 rounded-xl transition-all mb-6"
        >
          {carregando ? t("login_loading") : modo === MODO.LOGIN ? t("login_enter") : t("login_register")}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-100 dark:bg-[#2a2a2a]" />
          <span className="text-[10px] text-gray-300 dark:text-zinc-700 uppercase tracking-widest">{t("login_or")}</span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-[#2a2a2a]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleGoogle} className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#2a2a2a] hover:border-gray-400 dark:hover:border-zinc-600 rounded-xl py-2.5 text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button onClick={handleGitHub} className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#2a2a2a] hover:border-gray-400 dark:hover:border-zinc-600 rounded-xl py-2.5 text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            GitHub
          </button>
        </div>
      </div>

      <p className="text-[10px] text-gray-300 dark:text-zinc-700 mt-8 tracking-wider uppercase">{t("app_tagline")}</p>
    </div>
  )
}

export default Login