import { useState } from "react"
import Hoje from "./pages/Hoje"
import Calendario from "./pages/Calendario"
import Metas from "./pages/Metas"

const ABAS = [
  { id: "hoje", label: "Hoje" },
  { id: "calendario", label: "Calendário" },
  { id: "metas", label: "Metas" },
]

function App() {
  const [abaAtiva, setAbaAtiva] = useState("hoje")

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="border-b border-[#2a2a2a] bg-[#0f0f0f]">
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-0 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <h1 className="text-xl font-semibold tracking-widest text-white uppercase">
              Macro Tracker
            </h1>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-violet-500" />
            </div>
          </div>
          <p className="text-xs text-zinc-600 tracking-widest mb-5">ACOMPANHE SUA NUTRIÇÃO DIÁRIA</p>
          <div className="flex gap-0">
            {ABAS.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`px-6 py-2.5 text-xs tracking-widest uppercase border-b-2 transition-all ${
                  abaAtiva === aba.id
                    ? "border-violet-500 text-violet-400 font-medium"
                    : "border-transparent text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="pt-6 max-w-5xl mx-auto px-4">
        {abaAtiva === "hoje" && <Hoje />}
        {abaAtiva === "calendario" && <Calendario />}
        {abaAtiva === "metas" && <Metas />}
      </div>
    </div>
  )
}

export default App