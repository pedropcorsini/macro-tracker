import { useState } from "react"
import { useTracker } from "../context/TrackerContext"

const ABAS = ["Recentes", "Favoritos", "Mais usados"]

export default function AlimentosRapidos({ refeicaoAtiva, onAdicionar }) {
  const { state, dispatch } = useTracker()
  const [abaAtiva, setAbaAtiva] = useState("Recentes")
  const [quantidades, setQuantidades] = useState({})

  const listas = {
    Recentes: state.recentes,
    Favoritos: state.favoritos,
    "Mais usados": state.maisUsados,
  }

  const lista = listas[abaAtiva] || []

  function toggleFavorito(item) {
    dispatch({ type: "TOGGLE_FAVORITO", item })
  }

  function isFavorito(name) {
    return state.favoritos.some((f) => f.name === name)
  }

  function adicionarRapido(item) {
    const qty = quantidades[item.name] || 100
    const ratio = qty / 100
    dispatch({
      type: "ADD_FOOD",
      meal: refeicaoAtiva,
      item: {
        id: Date.now(),
        name: item.name,
        qty: `${qty}g`,
        cal: Math.round(item.cal * ratio),
        p: Math.round(item.p * ratio * 10) / 10,
        c: Math.round(item.c * ratio * 10) / 10,
        f: Math.round(item.f * ratio * 10) / 10,
      },
    })
    if (onAdicionar) onAdicionar()
  }

  if (state.recentes.length === 0 && state.favoritos.length === 0 && state.maisUsados.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-4 mb-3">
      <p className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Acesso rápido</p>

      {/* Abas */}
      <div className="flex gap-1 mb-3 bg-gray-50 dark:bg-[#0f0f0f] rounded-lg p-1">
        {ABAS.map((aba) => {
          const count = listas[aba]?.length || 0
          if (count === 0) return null
          return (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={`flex-1 py-1.5 rounded-md text-[10px] font-medium uppercase tracking-wider transition-all ${
                abaAtiva === aba
                  ? "bg-white dark:bg-[#2a2a2a] text-violet-600 dark:text-violet-400 shadow-sm"
                  : "text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400"
              }`}
            >
              {aba === "Mais usados" ? "Top" : aba}
              <span className="ml-1 opacity-60">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Lista */}
      {lista.length === 0 ? (
        <p className="text-xs text-gray-300 dark:text-zinc-700 text-center py-3">
          {abaAtiva === "Favoritos" ? "Nenhum favorito ainda. Clique no ♥ ao adicionar alimentos." : "Nenhum dado ainda."}
        </p>
      ) : (
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {lista.map((item) => {
            const qty = quantidades[item.name] || 100
            const ratio = qty / 100
            const fav = isFavorito(item.name)
            return (
              <div
                key={item.name}
                className="flex items-center gap-2 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-100 dark:border-[#2a2a2a] rounded-lg px-3 py-2"
              >
                {/* Favorito */}
                <button
                  onClick={() => toggleFavorito(item)}
                  className={`flex-shrink-0 text-sm transition-all ${fav ? "text-rose-500" : "text-gray-200 dark:text-zinc-700 hover:text-rose-400"}`}
                >
                  ♥
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 dark:text-zinc-300 truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-600">
                    {Math.round(item.cal * ratio)} kcal · {Math.round(item.p * ratio * 10) / 10}g P
                    {abaAtiva === "Mais usados" && item.count && (
                      <span className="ml-2 text-violet-400">usado {item.count}×</span>
                    )}
                  </p>
                </div>

                {/* Quantidade */}
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQuantidades((prev) => ({ ...prev, [item.name]: Number(e.target.value) }))}
                  className="w-14 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-1.5 py-1 text-xs text-gray-700 dark:text-zinc-200 outline-none text-center"
                />
                <span className="text-[10px] text-gray-300 dark:text-zinc-700">g</span>

                {/* Adicionar */}
                <button
                  onClick={() => adicionarRapido(item)}
                  className="flex-shrink-0 w-7 h-7 bg-violet-600 hover:bg-violet-500 text-white rounded-lg flex items-center justify-center text-sm font-medium transition-all"
                >
                  +
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}