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
      <div className="border-b border-[#2a2a2a] px-4 pt-5 pb-0 bg-[#0f0f0f]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <h1 className="text-sm font-medium text-white tracking-wide uppercase">Macro Tracker</h1>
          </div>
          <div className="flex gap-0">
            {ABAS.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`px-4 py-2 text-sm border-b-2 transition-all ${
                  abaAtiva === aba.id
                    ? "border-violet-400 text-white font-medium"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-4">
        {abaAtiva === "hoje" && <Hoje />}
        {abaAtiva === "calendario" && <Calendario />}
        {abaAtiva === "metas" && <Metas />}
      </div>
    </div>
  )
}

export default App