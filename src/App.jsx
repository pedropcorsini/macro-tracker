import { useState, useEffect } from "react"
import { supabase } from "./services/supabase"
import { TrackerProvider } from "./context/TrackerContext"
import { useTema } from "./context/ThemeContext"
import { useTranslation } from "react-i18next"
import "./styles/app.css"
import Login from "./pages/Login"
import Landing from "./pages/Landing"
import Hoje from "./pages/Hoje"
import Calendario from "./pages/Calendario"
import Metas from "./pages/Metas"
import Graficos from "./pages/Graficos"
import Favoritos from "./pages/Favoritos"
import LanguageSelect from "./components/LanguageSelect"

function AppInner() {
  const [abaAtiva, setAbaAtiva] = useState("hoje")
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const [mostrarLogin, setMostrarLogin] = useState(null)
  const { tema, isDark, alternandoTema, alternarTema } = useTema()
  const { t } = useTranslation()

  const ABAS = [
    { id: "hoje", labelKey: "nav_today", icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>) },
    { id: "calendario", labelKey: "nav_calendar", icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>) },
    { id: "metas", labelKey: "nav_goals", icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>) },
    { id: "graficos", labelKey: "nav_charts", icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>) },
    { id: "favoritos", labelKey: "nav_favorites", icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>) },
  ]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null)
      setCarregando(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUsuario(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function sair() {
    await supabase.auth.signOut()
    setMostrarLogin(null)
  }

  if (carregando) return (
    <div className="app-shell app-shell-loading min-h-screen flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin relative z-10" />
    </div>
  )

  if (!usuario) {
    return mostrarLogin
      ? <Login modo={mostrarLogin} onVoltar={() => setMostrarLogin(null)} />
      : <Landing onLogin={(modo) => setMostrarLogin(modo)} />
  }

  return (
    <TrackerProvider userId={usuario.id}>
      <div className="app-shell h-screen flex overflow-hidden transition-colors">

        {sidebarAberta && (
          <div className="app-mobile-overlay fixed inset-0 z-20 lg:hidden" onClick={() => setSidebarAberta(false)} />
        )}

        {/* SIDEBAR */}
        <aside className={`
          app-sidebar fixed top-0 left-0 z-30 flex flex-col w-64 h-screen overflow-y-auto
          border-r border-gray-100 dark:border-[#2a2a2a]
          transition-transform duration-300 flex-shrink-0
          ${sidebarAberta ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:z-auto lg:w-56
        `}>

          {/* Logo */}
          <div className="app-sidebar-brand px-5 pt-7 pb-6 border-b border-gray-100 dark:border-[#2a2a2a] flex-shrink-0 relative">
            <button
              onClick={() => setSidebarAberta(false)}
              className="lg:hidden absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#2a2a2a] text-gray-400 dark:text-zinc-500 text-lg"
            >
              ×
            </button>
            <div className="flex gap-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            </div>
            <h1 style={{ fontFamily: "'Bungee', cursive" }} className="text-sm tracking-widest text-gray-900 dark:text-white uppercase leading-tight">
              Macro<br />Tracker
            </h1>
            <p className="text-[9px] text-gray-300 dark:text-zinc-600 tracking-widest mt-1 uppercase">
              {t("app_subtitle")}
            </p>
          </div>

          {/* Navegação */}
          <nav className="app-sidebar-nav flex-1 min-h-0 px-3 py-4 space-y-1">
            {ABAS.map((aba) => (
              <button
                key={aba.id}
                onClick={() => { setAbaAtiva(aba.id); setSidebarAberta(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  abaAtiva === aba.id
                    ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium"
                    : "text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-gray-700 dark:hover:text-zinc-300"
                }`}
              >
                <span className={abaAtiva === aba.id ? "text-violet-500" : ""}>{aba.icon}</span>
                {t(aba.labelKey)}
                {abaAtiva === aba.id && <div className="ml-auto w-1 h-4 rounded-full bg-violet-500" />}
              </button>
            ))}
          </nav>

          {/* Rodapé */}
          <div className="app-sidebar-footer px-3 pb-5 space-y-1 border-t border-gray-100 dark:border-[#2a2a2a] pt-3 flex-shrink-0">
            <p className="text-[10px] text-gray-300 dark:text-zinc-700 px-3 truncate mb-2">{usuario.email}</p>

            <LanguageSelect variant={isDark ? "dark" : "light"} fullWidth />

            <button
              onClick={alternarTema}
              disabled={alternandoTema}
              aria-label={t(tema === "dark" ? "light_mode" : "dark_mode")}
              aria-pressed={isDark}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-gray-700 dark:hover:text-zinc-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
              {t(isDark ? "light_mode" : "dark_mode")}
            </button>

            <button
              onClick={sair}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 dark:text-zinc-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {t("sign_out")}
            </button>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="app-main flex-1 min-w-0 flex flex-col h-screen overflow-hidden">

          <div className="app-mobile-header lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#2a2a2a] flex-shrink-0">
            <button onClick={() => setSidebarAberta(true)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-zinc-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 style={{ fontFamily: "'Bungee', cursive" }} className="text-sm tracking-widest text-gray-900 dark:text-white uppercase">
              Macro Tracker
            </h1>
            <button
              onClick={alternarTema}
              disabled={alternandoTema}
              aria-label={t(tema === "dark" ? "light_mode" : "dark_mode")}
              aria-pressed={isDark}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-zinc-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDark ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </div>

          <main className="app-main-content flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="app-main-inner max-w-5xl mx-auto">
              {abaAtiva === "hoje" && <Hoje />}
              {abaAtiva === "calendario" && <Calendario />}
              {abaAtiva === "metas" && <Metas />}
              {abaAtiva === "graficos" && <Graficos />}
              {abaAtiva === "favoritos" && <Favoritos />}
            </div>
          </main>
        </div>
      </div>
    </TrackerProvider>
  )
}

export default AppInner
