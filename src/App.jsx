import { useState, useEffect } from "react"
import { supabase } from "./services/supabase"
import { TrackerProvider } from "./context/TrackerContext"
import { useTema } from "./context/ThemeContext"
import Login from "./pages/Login"
import Hoje from "./pages/Hoje"
import Calendario from "./pages/Calendario"
import Metas from "./pages/Metas"

const ABAS = [
  { id: "hoje", label: "Hoje" },
  { id: "calendario", label: "Calendário" },
  { id: "metas", label: "Metas" },
]

function AppInner() {
  const [abaAtiva, setAbaAtiva] = useState("hoje")
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const { tema, alternarTema } = useTema()

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
  }

  if (carregando) return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!usuario) return <Login />

  return (
    <TrackerProvider userId={usuario.id}>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] transition-colors">
        <div className="border-b border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0f0f0f] transition-colors">
          <div className="max-w-5xl mx-auto px-4 pt-6 pb-0 flex flex-col items-center relative">

            {/* Controles direita */}
            <div className="absolute inset-x-4 top-4 flex items-center justify-between">
              {/* Toggle tema */}
              <button
                onClick={alternarTema}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-zinc-500 hover:text-gray-800 dark:hover:text-zinc-200 transition-all"
                title={tema === "dark" ? "Modo claro" : "Modo escuro"}
              >
                {tema === "dark" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
                  <button
                    onClick={sair}
                    className="text-[10px] text-gray-400 dark:text-zinc-600 hover:text-rose-400 border border-gray-200 dark:border-[#2a2a2a] hover:border-rose-400/30 px-3 py-1.5 rounded-lg uppercase tracking-widest transition-all"
                >
                    Sair
                  </button>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-3 mb-1">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="w-2 h-2 rounded-full bg-rose-500" />
              </div>
              <h1 style={{ fontFamily: "'Bungee', cursive" }} className="text-base sm:text-xl tracking-widest       text-gray-900 dark:text-white uppercase">
                Macro Tracker
              </h1>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="w-2 h-2 rounded-full bg-violet-500" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-zinc-600 tracking-widest mb-4">Organize sua alimentação diária</p>

            {/* Abas */}
            <div className="flex gap-0 w-full sm:w-auto justify-center">
              {ABAS.map((aba) => (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-[10px] sm:text-xs tracking-widest uppercase border-b-2 transition-all ${
                    abaAtiva === aba.id
                      ? "border-violet-500 text-violet-500 font-medium"
                      : "border-transparent text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400"
                  }`}
                >
                  {aba.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 sm:pt-6 max-w-5xl mx-auto px-3 sm:px-4">
          {abaAtiva === "hoje" && <Hoje />}
          {abaAtiva === "calendario" && <Calendario />}
          {abaAtiva === "metas" && <Metas />}
        </div>
      </div>
    </TrackerProvider>
  )
}

export default AppInner