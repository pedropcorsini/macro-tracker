import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import { useTranslation } from "react-i18next"

export default function Favoritos() {
  const { state, dispatch } = useTracker()
  const { t } = useTranslation()
  const [quantidades, setQuantidades] = useState({})
  const [refeicaoAtiva, setRefeicaoAtiva] = useState("")
  const [adicionado, setAdicionado] = useState(null)

  const REFEICOES = [
    t("meal_breakfast"), t("meal_lunch"), t("meal_snack"), t("meal_dinner")
  ]

  const refeicaoSelecionada = refeicaoAtiva || REFEICOES[0]

  function toggleFavorito(item) {
    dispatch({ type: "TOGGLE_FAVORITO", item })
  }

  function adicionarRapido(item) {
    const qty = quantidades[item.name] || 100
    const ratio = qty / 100
    dispatch({
      type: "ADD_FOOD",
      meal: refeicaoSelecionada,
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
    setAdicionado(item.name)
    setTimeout(() => setAdicionado(null), 1500)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-200">{t("favorites_title")}</h2>
        <p className="text-xs text-gray-400 dark:text-zinc-600 mt-0.5">{t("favorites_subtitle")}</p>
      </div>

      {/* Seletor de refeição */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-4">
        <p className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-3">{t("add_to")}</p>
        <div className="flex gap-2 flex-wrap">
          {REFEICOES.map((r) => (
            <button
              key={r}
              onClick={() => setRefeicaoAtiva(r)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                refeicaoSelecionada === r
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-500"
                  : "border-gray-200 dark:border-[#2a2a2a] text-gray-400 dark:text-zinc-600 hover:border-gray-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de favoritos */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-rose-500 text-sm">♥</span>
          <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">{t("favorites")}</p>
          <span className="text-[10px] text-gray-300 dark:text-zinc-700 ml-auto">{state.favoritos.length} {t("items")}</span>
        </div>

        {state.favoritos.length === 0 ? (
          <p className="text-xs text-gray-300 dark:text-zinc-700 py-6 text-center">{t("no_favorites")}</p>
        ) : (
          <div className="space-y-2">
            {state.favoritos.map((item) => {
              const qty = quantidades[item.name] || 100
              const ratio = qty / 100
              const foiAdicionado = adicionado === item.name
              return (
                <div key={item.name} className="flex items-center gap-3 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-100 dark:border-[#2a2a2a] rounded-xl px-3 py-2.5">
                  <button
                    onClick={() => toggleFavorito(item)}
                    className="flex-shrink-0 transition-all text-base text-rose-500 hover:text-rose-400"
                  >
                    ♥
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-zinc-300 truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-600">
                      {Math.round(item.cal * ratio)} kcal · {Math.round(item.p * ratio * 10) / 10}g P · {Math.round(item.c * ratio * 10) / 10}g C · {Math.round(item.f * ratio * 10) / 10}g G
                    </p>
                  </div>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQuantidades((prev) => ({ ...prev, [item.name]: Number(e.target.value) }))}
                    className="w-16 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-2 py-1 text-xs text-gray-700 dark:text-zinc-200 outline-none text-center"
                  />
                  <span className="text-[10px] text-gray-300 dark:text-zinc-700">g</span>
                  <button
                    onClick={() => adicionarRapido(item)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      foiAdicionado ? "bg-emerald-500 text-white" : "bg-violet-600 hover:bg-violet-500 text-white"
                    }`}
                  >
                    {foiAdicionado ? "✓" : "+"}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}