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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-0">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-medium text-gray-800 mb-3">Macro Tracker</h1>
          <div className="flex gap-0">
            {ABAS.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`px-4 py-2 text-sm border-b-2 transition-all ${
                  abaAtiva === aba.id
                    ? "border-gray-800 text-gray-800 font-medium"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="pt-2">
        {abaAtiva === "hoje" && <Hoje />}
        {abaAtiva === "calendario" && <Calendario />}
        {abaAtiva === "metas" && <Metas />}
      </div>
    </div>
  )
}

export default App