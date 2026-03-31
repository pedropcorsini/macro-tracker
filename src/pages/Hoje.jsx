import { useState, useEffect, useRef } from "react"
import { useTracker } from "../context/TrackerContext"
import { buscarAlimentos } from "../services/usda"

const REFEICOES = ["Café da manhã", "Almoço", "Lanche da tarde", "Jantar"]

const CONFIG_MACROS = [
  { key: "cal", lbl: "Calorias", unit: "kcal", cor: "bg-violet-500", corTexto: "text-violet-500" },
  { key: "p",   lbl: "Proteína", unit: "g",    cor: "bg-emerald-500", corTexto: "text-emerald-500" },
  { key: "c",   lbl: "Carbs",    unit: "g",    cor: "bg-amber-500",   corTexto: "text-amber-500" },
  { key: "f",   lbl: "Gordura",  unit: "g",    cor: "bg-rose-500",    corTexto: "text-rose-500" },
]

function Hoje() {
  const { state, dispatch } = useTracker()
  const [refeicaoAtiva, setRefeicaoAtiva] = useState("Café da manhã")
  const [busca, setBusca] = useState("")
  const [resultados, setResultados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [alimentoSelecionado, setAlimentoSelecionado] = useState(null)
  const [quantidade, setQuantidade] = useState(100)
  const [modoUnidade, setModoUnidade] = useState(false)
  const [mlManual, setMlManual] = useState("")
  const debounceRef = useRef(null)

  const hoje = new Date().toISOString().split("T")[0]
  const logHoje = state.logs[hoje] || {
    "Café da manhã": [], Almoço: [], "Lanche da tarde": [], Jantar: [],
  }

  const totais = Object.values(logHoje).flat().reduce(
    (a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }),
    { cal: 0, p: 0, c: 0, f: 0 }
  )

  const { goals } = state
  const aguaHoje = state.waterLog[hoje] || 0
  const waterUnit = goals.waterUnit || "ml"
  const totalCopos = Math.ceil(goals.water / goals.cupMl)
  const coposCheios = Math.round(aguaHoje / goals.cupMl)
  const aguaPct = Math.min(100, goals.water > 0 ? Math.round(aguaHoje / goals.water * 100) : 0)
  const waterDisplay = waterUnit === "L" ? (aguaHoje / 1000).toFixed(1) + "L" : aguaHoje + "ml"
  const waterMetaDisplay = waterUnit === "L" ? (goals.water / 1000).toFixed(1) + "L" : goals.water + "ml"

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
    setModoUnidade(false)
    setBusca("")
    setResultados([])
  }

  function adicionarAlimento() {
    if (!alimentoSelecionado) return
    const gramas = modoUnidade ? quantidade * alimentoSelecionado.gramsPerUnit : quantidade
    const ratio = gramas / 100
    dispatch({
      type: "ADD_FOOD",
      meal: refeicaoAtiva,
      item: {
        id: Date.now(),
        name: alimentoSelecionado.name,
        qty: modoUnidade ? `${quantidade} ${alimentoSelecionado.unit}(s)` : `${quantidade}g`,
        cal: Math.round(alimentoSelecionado.cal * ratio),
        p: Math.round(alimentoSelecionado.p * ratio * 10) / 10,
        c: Math.round(alimentoSelecionado.c * ratio * 10) / 10,
        f: Math.round(alimentoSelecionado.f * ratio * 10) / 10,
      },
    })
    setAlimentoSelecionado(null)
    setQuantidade(100)
    setModoUnidade(false)
  }

  function removerAlimento(id) {
    dispatch({ type: "REMOVE_FOOD", meal: refeicaoAtiva, id })
  }

  function adicionarAgua() {
    const val = parseFloat(mlManual)
    if (!val || val <= 0) return
    const emMl = waterUnit === "L" ? val * 1000 : val
    dispatch({ type: "SET_WATER", amount: aguaHoje + emMl })
    setMlManual("")
  }

  function totaisRefeicao(refeicao) {
    return (logHoje[refeicao] || []).reduce(
      (a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }),
      { cal: 0, p: 0, c: 0, f: 0 }
    )
  }

  const refeicaoTemItens = REFEICOES.some((r) => (logHoje[r] || []).length > 0)
  const gramas = alimentoSelecionado ? (modoUnidade ? quantidade * (alimentoSelecionado.gramsPerUnit || 100) : quantidade) : 0

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start">

      {/* COLUNA PRINCIPAL */}
      <div className="flex-1 min-w-0 w-full space-y-3">

        {/* Cards de macros */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CONFIG_MACROS.map((m) => {
            const val = Math.round(totais[m.key])
            const meta = goals[m.key]
            const pct = meta > 0 ? Math.min(100, Math.round(val / meta * 100)) : 0
            return (
              <div key={m.key} className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-4">
                <p className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-3">{m.lbl}</p>
                <p className={`text-2xl font-semibold ${m.corTexto}`}>{val}</p>
                <p className="text-[10px] text-gray-300 dark:text-zinc-700 mb-3">de {meta} {m.unit}</p>
                <div className="h-0.5 bg-gray-100 dark:bg-[#2a2a2a] rounded-full">
                  <div className={`h-0.5 rounded-full ${m.cor} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-gray-300 dark:text-zinc-700 mt-1 text-right">{pct}%</p>
              </div>
            )
          })}
        </div>

        {/* Água */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-4">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <p className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-widest">Consumo de água</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-500 font-medium">{waterDisplay} / {waterMetaDisplay}</span>
              <div className="flex bg-gray-100 dark:bg-[#0f0f0f] rounded-lg p-0.5">
                {["ml", "L"].map((u) => (
                  <button
                    key={u}
                    onClick={() => dispatch({ type: "SET_GOALS", goals: { ...goals, waterUnit: u } })}
                    className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                      waterUnit === u
                        ? "bg-white dark:bg-[#2a2a2a] text-blue-500 shadow-sm"
                        : "text-gray-400 dark:text-zinc-600"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-1.5 bg-gray-100 dark:bg-[#2a2a2a] rounded-full mb-4">
            <div className="h-1.5 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${aguaPct}%` }} />
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-4">
            {Array.from({ length: totalCopos }).map((_, i) => (
              <button
                key={i}
                onClick={() => dispatch({ type: "SET_WATER", amount: (i < coposCheios ? i : i + 1) * goals.cupMl })}
                className={`w-8 h-8 rounded-lg border text-[10px] font-medium transition-all ${
                  i < coposCheios
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-500"
                    : "border-gray-200 dark:border-[#2a2a2a] text-gray-300 dark:text-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <span className="text-[10px] text-gray-300 dark:text-zinc-700 ml-1">
              {goals.water - aguaHoje > 0
                ? `faltam ${waterUnit === "L" ? ((goals.water - aguaHoje) / 1000).toFixed(1) + "L" : (goals.water - aguaHoje) + "ml"}`
                : "meta atingida!"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={mlManual}
              onChange={(e) => setMlManual(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && adicionarAgua()}
              placeholder={`Digitar ${waterUnit} manualmente...`}
              className="flex-1 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 placeholder-gray-300 dark:placeholder-zinc-700 outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-all"
            />
            <span className="text-xs text-gray-400 dark:text-zinc-600">{waterUnit}</span>
            <button onClick={adicionarAgua} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg transition-all">
              Adicionar
            </button>
            {aguaHoje > 0 && (
              <button onClick={() => dispatch({ type: "SET_WATER", amount: 0 })} className="text-gray-300 dark:text-zinc-700 hover:text-rose-400 text-xs px-1 transition-all">
                Zerar
              </button>
            )}
          </div>
        </div>

        {/* Refeições */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-4">
          <div className="flex gap-2 flex-wrap mb-4">
            {REFEICOES.map((r) => (
              <button
                key={r}
                onClick={() => { setRefeicaoAtiva(r); setAlimentoSelecionado(null); setBusca(""); setResultados([]) }}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  refeicaoAtiva === r
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-500"
                    : "border-gray-200 dark:border-[#2a2a2a] text-gray-400 dark:text-zinc-600 hover:border-gray-400 dark:hover:border-zinc-500"
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
              placeholder="Buscar alimento (ex: frango, arroz, banana)..."
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setAlimentoSelecionado(null) }}
              className="w-full bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-zinc-300 placeholder-gray-300 dark:placeholder-zinc-600 outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-all"
            />
            {carregando && (
              <div className="absolute right-3 top-3 w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Resultados */}
          {resultados.length > 0 && (
            <div className="max-h-52 overflow-y-auto rounded-lg border border-gray-100 dark:border-[#2a2a2a] mb-3">
              {resultados.map((f) => (
                <div
                  key={f.id}
                  onClick={() => selecionarAlimento(f)}
                  className="flex items-center justify-between px-3 py-2.5 border-b border-gray-50 dark:border-[#2a2a2a] last:border-0 hover:bg-gray-50 dark:hover:bg-[#242424] cursor-pointer transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-zinc-200 truncate">{f.name}</p>
                    {f.fonte === "local"
                      ? <span className="text-[10px] text-emerald-600 uppercase tracking-wider">banco local</span>
                      : f.brand
                        ? <p className="text-xs text-gray-400 dark:text-zinc-600">{f.brand}</p>
                        : <span className="text-[10px] text-blue-500 uppercase tracking-wider">USDA</span>
                    }
                    <p className="text-xs text-gray-400 dark:text-zinc-600">{f.cal} kcal · {f.p}g P · {f.c}g C · {f.f}g G <span className="text-gray-300 dark:text-zinc-700">(por 100g)</span></p>
                  </div>
                  <span className="text-violet-500 text-lg ml-3">+</span>
                </div>
              ))}
            </div>
          )}

          {/* Quantidade + unidade */}
          {alimentoSelecionado && (
            <div className="bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-3 py-3 mb-3 space-y-2">
              <p className="text-xs text-gray-600 dark:text-zinc-400 truncate">{alimentoSelecionado.name}</p>

              {alimentoSelecionado.unit && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setModoUnidade(false); setQuantidade(100) }}
                    className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                      !modoUnidade
                        ? "bg-violet-500/20 border-violet-500/40 text-violet-500"
                        : "border-gray-200 dark:border-[#2a2a2a] text-gray-400 dark:text-zinc-600"
                    }`}
                  >
                    Gramas
                  </button>
                  <button
                    onClick={() => { setModoUnidade(true); setQuantidade(1) }}
                    className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                      modoUnidade
                        ? "bg-violet-500/20 border-violet-500/40 text-violet-500"
                        : "border-gray-200 dark:border-[#2a2a2a] text-gray-400 dark:text-zinc-600"
                    }`}
                  >
                    {alimentoSelecionado.unit.charAt(0).toUpperCase() + alimentoSelecionado.unit.slice(1)}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="number"
                  value={quantidade}
                  min={modoUnidade ? 0.5 : 1}
                  step={modoUnidade ? 0.5 : 1}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-24 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-2 py-1.5 text-sm text-gray-700 dark:text-zinc-200 outline-none text-center"
                />
                <span className="text-xs text-gray-400 dark:text-zinc-600">
                  {modoUnidade ? `${alimentoSelecionado.unit}(s) = ${Math.round(gramas)}g` : "g"}
                </span>
                <button
                  onClick={adicionarAlimento}
                  className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-1.5 rounded-lg transition-all ml-auto"
                >
                  Adicionar
                </button>
              </div>

              {/* Preview macros */}
              {quantidade > 0 && (
                <div className="flex gap-4 pt-1">
                  {[
                    { lbl: "kcal", val: Math.round(alimentoSelecionado.cal * gramas / 100), cor: "text-violet-500" },
                    { lbl: "prot", val: (Math.round(alimentoSelecionado.p * gramas / 100 * 10) / 10) + "g", cor: "text-emerald-500" },
                    { lbl: "carbs", val: (Math.round(alimentoSelecionado.c * gramas / 100 * 10) / 10) + "g", cor: "text-amber-500" },
                    { lbl: "gord", val: (Math.round(alimentoSelecionado.f * gramas / 100 * 10) / 10) + "g", cor: "text-rose-500" },
                  ].map((m) => (
                    <div key={m.lbl}>
                      <p className="text-[9px] text-gray-300 dark:text-zinc-700 uppercase">{m.lbl}</p>
                      <p className={`text-xs font-medium ${m.cor}`}>{m.val}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Itens adicionados */}
          {logHoje[refeicaoAtiva]?.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-300 dark:text-zinc-600 uppercase tracking-widest mb-2">Adicionado em {refeicaoAtiva}</p>
              <div className="space-y-1.5">
                {logHoje[refeicaoAtiva].map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-[#0f0f0f] border border-gray-100 dark:border-[#2a2a2a] rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-zinc-300">{item.name} <span className="text-gray-300 dark:text-zinc-600">— {item.qty}</span></p>
                      <p className="text-xs text-gray-400 dark:text-zinc-600">{item.cal} kcal · {item.p}g P · {item.c}g C · {item.f}g G</p>
                    </div>
                    <button onClick={() => removerAlimento(item.id)} className="text-gray-300 dark:text-zinc-700 hover:text-rose-400 text-xl px-1 transition-all">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PAINEL LATERAL */}
      <div className="w-full lg:w-64 lg:flex-shrink-0 space-y-3 lg:sticky lg:top-6">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-4">
          <p className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-4">Resumo do dia</p>

          {!refeicaoTemItens ? (
            <p className="text-xs text-gray-300 dark:text-zinc-700 text-center py-4">Nenhuma refeição registrada ainda.</p>
          ) : (
            <div className="space-y-4">
              {REFEICOES.map((r) => {
                const items = logHoje[r] || []
                if (items.length === 0) return null
                const t = totaisRefeicao(r)
                return (
                  <div key={r}>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{r}</p>
                    <div className="space-y-1 mb-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-zinc-400 truncate flex-1">{item.name}</span>
                          <span className="text-[10px] text-gray-300 dark:text-zinc-600 ml-2 flex-shrink-0">{item.cal} kcal</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 dark:bg-[#0f0f0f] rounded-lg p-2 border border-gray-100 dark:border-[#2a2a2a]">
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { lbl: "Kcal", val: Math.round(t.cal), cor: "text-violet-500" },
                          { lbl: "Prot", val: Math.round(t.p) + "g", cor: "text-emerald-500" },
                          { lbl: "Carbs", val: Math.round(t.c) + "g", cor: "text-amber-500" },
                          { lbl: "Gord", val: Math.round(t.f) + "g", cor: "text-rose-500" },
                        ].map((m) => (
                          <div key={m.lbl}>
                            <p className="text-[9px] text-gray-300 dark:text-zinc-700 uppercase">{m.lbl}</p>
                            <p className={`text-xs font-medium ${m.cor}`}>{m.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-b border-gray-100 dark:border-[#2a2a2a] mt-3" />
                  </div>
                )
              })}

              {/* Total geral */}
              <div>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Total geral</p>
                <div className="bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { lbl: "Kcal", val: Math.round(totais.cal), cor: "text-violet-500" },
                      { lbl: "Proteína", val: Math.round(totais.p) + "g", cor: "text-emerald-500" },
                      { lbl: "Carbos", val: Math.round(totais.c) + "g", cor: "text-amber-500" },
                      { lbl: "Gordura", val: Math.round(totais.f) + "g", cor: "text-rose-500" },
                    ].map((m) => (
                      <div key={m.lbl}>
                        <p className="text-[9px] text-gray-400 dark:text-zinc-600 uppercase">{m.lbl}</p>
                        <p className={`text-sm font-semibold ${m.cor}`}>{m.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Hoje