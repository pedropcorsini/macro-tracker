import { useState, useEffect, useRef } from "react"
import { useTracker } from "../context/TrackerContext"
import { buscarAlimentos } from "../services/usda"

const REFEICOES = ["Café da manhã", "Almoço", "Lanche da tarde", "Jantar"]

const CORES_MACRO = {
  Calorias: "bg-violet-500",
  Proteína: "bg-emerald-500",
  Carbs: "bg-amber-500",
  Gordura: "bg-rose-500",
  Água: "bg-blue-500",
}

function Hoje() {
  const { state, dispatch } = useTracker()
  const [refeicaoAtiva, setRefeicaoAtiva] = useState("Café da manhã")
  const [busca, setBusca] = useState("")
  const [resultados, setResultados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [alimentoSelecionado, setAlimentoSelecionado] = useState(null)
  const [quantidade, setQuantidade] = useState(100)
  const debounceRef = useRef(null)

  const hoje = new Date().toISOString().split("T")[0]
  const logHoje = state.logs[hoje] || {
    "Café da manhã": [], Almoço: [], "Lanche da tarde": [], Jantar: [],
  }

  const totais = Object.values(logHoje).flat().reduce(
    (a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }),
    { cal: 0, p: 0, c: 0, f: 0 }
  )

  useEffect(() => {
    if (busca.trim().length < 2) { setResultados([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setCarregando(true)
      try {
        const dados = await buscarAlimentos(busca)
        setResultados(dados)
      } catch {
        setResultados([])
      } finally {
        setCarregando(false)
      }
    }, 500)
  }, [busca])

  function selecionarAlimento(alimento) {
    setAlimentoSelecionado(alimento)
    setQuantidade(100)
    setBusca("")
    setResultados([])
  }

  function adicionarAlimento() {
    if (!alimentoSelecionado) return
    const ratio = quantidade / 100
    dispatch({
      type: "ADD_FOOD",
      meal: refeicaoAtiva,
      item: {
        id: Date.now(),
        name: alimentoSelecionado.name,
        qty: quantidade,
        cal: Math.round(alimentoSelecionado.cal * ratio),
        p: Math.round(alimentoSelecionado.p * ratio * 10) / 10,
        c: Math.round(alimentoSelecionado.c * ratio * 10) / 10,
        f: Math.round(alimentoSelecionado.f * ratio * 10) / 10,
      },
    })
    setAlimentoSelecionado(null)
    setQuantidade(100)
  }

  function removerAlimento(id) {
    dispatch({ type: "REMOVE_FOOD", meal: refeicaoAtiva, id })
  }

  const { goals } = state
  const aguaHoje = state.waterLog[hoje] || 0
  const totalCopos = Math.ceil(goals.water / goals.cupMl)
  const coposCheios = Math.round(aguaHoje / goals.cupMl)

  const macros = [
    { lbl: "Calorias", val: Math.round(totais.cal), meta: goals.cal, unit: "kcal" },
    { lbl: "Proteína", val: Math.round(totais.p), meta: goals.p, unit: "g" },
    { lbl: "Carbs", val: Math.round(totais.c), meta: goals.c, unit: "g" },
    { lbl: "Gordura", val: Math.round(totais.f), meta: goals.f, unit: "g" },
    { lbl: "Água", val: aguaHoje, meta: goals.water, unit: "ml" },
  ]

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-3">

      {/* Cards de macros */}
      <div className="grid grid-cols-5 gap-2">
        {macros.map((m) => {
          const pct = m.meta > 0 ? Math.min(100, Math.round(m.val / m.meta * 100)) : 0
          return (
            <div key={m.lbl} className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-3">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">{m.lbl}</p>
              <p className="text-base font-medium text-white">{m.val}</p>
              <p className="text-[10px] text-zinc-600 mb-2">{m.unit}</p>
              <div className="h-0.5 bg-[#2a2a2a] rounded-full">
                <div
                  className={`h-0.5 rounded-full ${CORES_MACRO[m.lbl]}`}
                  style={{ width: `${pct}%`, transition: "width 0.4s" }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Água */}
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Consumo de água</p>
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from({ length: totalCopos }).map((_, i) => (
            <button
              key={i}
              onClick={() => dispatch({ type: "SET_WATER", amount: (i < coposCheios ? i : i + 1) * goals.cupMl })}
              className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${
                i < coposCheios
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                  : "border-[#2a2a2a] text-zinc-600 hover:border-zinc-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <span className="text-xs text-zinc-600 ml-1">{aguaHoje} / {goals.water} ml</span>
        </div>
      </div>

      {/* Refeições */}
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4">
        <div className="flex gap-2 flex-wrap mb-4">
          {REFEICOES.map((r) => (
            <button
              key={r}
              onClick={() => { setRefeicaoAtiva(r); setAlimentoSelecionado(null); setBusca(""); setResultados([]) }}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                refeicaoAtiva === r
                  ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                  : "border-[#2a2a2a] text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Busca */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Buscar alimento na base USDA (ex: chicken breast, rice)..."
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setAlimentoSelecionado(null) }}
            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-all"
          />
          {carregando && (
            <div className="absolute right-3 top-3 w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Resultados da busca */}
        {resultados.length > 0 && (
          <div className="max-h-52 overflow-y-auto rounded-lg border border-[#2a2a2a] mb-3">
            {resultados.map((f) => (
              <div
                key={f.id}
                onClick={() => selecionarAlimento(f)}
                className="flex items-center justify-between px-3 py-2.5 border-b border-[#2a2a2a] last:border-0 hover:bg-[#242424] cursor-pointer transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{f.name}</p>
                  {f.fonte === "local"
                    ? <span className="text-[10px] text-emerald-600 uppercase tracking-wider">banco local</span>
                    : f.brand
                      ? <p className="text-xs text-zinc-600">{f.brand}</p>
                      : <span className="text-[10px] text-blue-600 uppercase tracking-wider">USDA</span>
                  }
                  <p className="text-xs text-zinc-500">{f.cal} kcal · {f.p}g P · {f.c}g C · {f.f}g G <span className="text-zinc-700">(por 100g)</span></p>
                </div>
                <span className="text-violet-500 text-lg ml-3 flex-shrink-0">+</span>
              </div>
            ))}
          </div>
        )}

        {/* Quantidade */}
        {alimentoSelecionado && (
          <div className="flex items-center gap-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 mb-3">
            <span className="text-sm text-zinc-300 flex-1 truncate">{alimentoSelecionado.name}</span>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-20 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-sm text-zinc-200 outline-none text-center"
            />
            <span className="text-sm text-zinc-600">g</span>
            <button
              onClick={adicionarAlimento}
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-1.5 rounded-lg transition-all"
            >
              Adicionar
            </button>
          </div>
        )}

        {/* Itens adicionados */}
        {logHoje[refeicaoAtiva]?.length > 0 && (
          <div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Adicionado em {refeicaoAtiva}</p>
            <div className="space-y-1.5">
              {logHoje[refeicaoAtiva].map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2">
                  <div>
                    <p className="text-sm text-zinc-300">{item.name} <span className="text-zinc-600">— {item.qty}g</span></p>
                    <p className="text-xs text-zinc-600">{item.cal} kcal · {item.p}g P · {item.c}g C · {item.f}g G</p>
                  </div>
                  <button onClick={() => removerAlimento(item.id)} className="text-zinc-700 hover:text-rose-400 text-xl px-1 transition-all">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Hoje