import { useState, useEffect, useRef } from "react"
import { useTracker } from "../context/TrackerContext"
import { buscarAlimentos } from "../services/usda"

const REFEICOES = ["Café da manhã", "Almoço", "Lanche da tarde", "Jantar"]

const CONFIG_MACROS = [
  { key: "cal", lbl: "Calorias", unit: "kcal", cor: "bg-violet-500", corTexto: "text-violet-400" },
  { key: "p",   lbl: "Proteína", unit: "g",    cor: "bg-emerald-500", corTexto: "text-emerald-400" },
  { key: "c",   lbl: "Carbs",    unit: "g",    cor: "bg-amber-500",   corTexto: "text-amber-400" },
  { key: "f",   lbl: "Gordura",  unit: "g",    cor: "bg-rose-500",    corTexto: "text-rose-400" },
]

function Hoje() {
  const { state, dispatch } = useTracker()
  const [refeicaoAtiva, setRefeicaoAtiva] = useState("Café da manhã")
  const [busca, setBusca] = useState("")
  const [resultados, setResultados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [alimentoSelecionado, setAlimentoSelecionado] = useState(null)
  const [quantidade, setQuantidade] = useState(100)
  const [mlManual, setMlManual] = useState("")
  const [modoUnidade, setModoUnidade] = useState(false)
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
  const totalCopos = Math.ceil(goals.water / goals.cupMl)
  const coposCheios = Math.round(aguaHoje / goals.cupMl)
  const aguaPct = Math.min(100, goals.water > 0 ? Math.round(aguaHoje / goals.water * 100) : 0)

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

  function adicionarMlManual() {
    const ml = parseInt(mlManual)
    if (!ml || ml <= 0) return
    dispatch({ type: "SET_WATER", amount: aguaHoje + ml })
    setMlManual("")
  }

  // totais por refeição para o painel lateral
  function totaisRefeicao(refeicao) {
    const items = logHoje[refeicao] || []
    return items.reduce(
      (a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }),
      { cal: 0, p: 0, c: 0, f: 0 }
    )
  }

  const refeicaoTemItens = REFEICOES.some((r) => (logHoje[r] || []).length > 0)

  return (
    <div className="flex gap-4 items-start">

      {/* COLUNA PRINCIPAL */}
      <div className="flex-1 min-w-0 space-y-3">

        {/* Cards de macros */}
        <div className="grid grid-cols-4 gap-2">
          {CONFIG_MACROS.map((m) => {
            const val = m.key === "cal" ? Math.round(totais.cal)
              : m.key === "p" ? Math.round(totais.p)
              : m.key === "c" ? Math.round(totais.c)
              : Math.round(totais.f)
            const meta = goals[m.key]
            const pct = meta > 0 ? Math.min(100, Math.round(val / meta * 100)) : 0
            return (
              <div key={m.key} className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">{m.lbl}</p>
                <p className={`text-2xl font-semibold ${m.corTexto}`}>{val}</p>
                <p className="text-[10px] text-zinc-700 mb-3">de {meta} {m.unit}</p>
                <div className="h-0.5 bg-[#2a2a2a] rounded-full">
                  <div className={`h-0.5 rounded-full ${m.cor} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-zinc-700 mt-1 text-right">{pct}%</p>
              </div>
            )
          })}
        </div>

        {/* Água */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Consumo de água</p>
            <span className="text-xs text-blue-400 font-medium">{aguaHoje} / {goals.water} ml</span>
          </div>

          {/* Barra de progresso */}
          <div className="h-1.5 bg-[#2a2a2a] rounded-full mb-4">
            <div
              className="h-1.5 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${aguaPct}%` }}
            />
          </div>

          {/* Copos */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {Array.from({ length: totalCopos }).map((_, i) => (
              <button
                key={i}
                onClick={() => dispatch({ type: "SET_WATER", amount: (i < coposCheios ? i : i + 1) * goals.cupMl })}
                className={`w-8 h-8 rounded-lg border text-[10px] font-medium transition-all ${
                  i < coposCheios
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                    : "border-[#2a2a2a] text-zinc-700 hover:border-zinc-600 hover:text-zinc-500"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <span className="text-[10px] text-zinc-700 ml-1">
              {goals.water - aguaHoje > 0 ? `faltam ${goals.water - aguaHoje} ml` : "meta atingida!"}
            </span>
          </div>

          {/* Input manual */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={mlManual}
              onChange={(e) => setMlManual(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && adicionarMlManual()}
              placeholder="Digitar ml manualmente..."
              className="flex-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder-zinc-700 outline-none focus:border-zinc-600 transition-all"
            />
            <span className="text-xs text-zinc-600">ml</span>
            <button
              onClick={adicionarMlManual}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg transition-all"
            >
              Adicionar
            </button>
            {aguaHoje > 0 && (
              <button
                onClick={() => dispatch({ type: "SET_WATER", amount: 0 })}
                className="text-zinc-700 hover:text-rose-400 text-xs px-2 py-2 transition-all"
              >
                Zerar
              </button>
            )}
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
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                    : "border-[#2a2a2a] text-zinc-600 hover:border-zinc-600 hover:text-zinc-300"
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
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-all"
            />
            {carregando && (
              <div className="absolute right-3 top-3 w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Resultados */}
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
                    <p className="text-xs text-zinc-600">{f.cal} kcal · {f.p}g P · {f.c}g C · {f.f}g G <span className="text-zinc-700">(por 100g)</span></p>
                  </div>
                  <span className="text-violet-500 text-lg ml-3">+</span>
                </div>
              ))}
            </div>
          )}

          {/* Quantidade */}
          {alimentoSelecionado && (
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-3 mb-3 space-y-2">
              <p className="text-xs text-zinc-400 truncate">{alimentoSelecionado.name}</p>

              {/* Toggle gramas / unidade */}
              {alimentoSelecionado.unit && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setModoUnidade(false); setQuantidade(100) }}
                    className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                      !modoUnidade
                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                        : "border-[#2a2a2a] text-zinc-600 hover:border-zinc-600"
                    }`}
                  >
                    Gramas
                  </button>
                  <button
                    onClick={() => { setModoUnidade(true); setQuantidade(1) }}
                    className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                      modoUnidade
                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                        : "border-[#2a2a2a] text-zinc-600 hover:border-zinc-600"
                    }`}
                  >
                    {alimentoSelecionado.unit.charAt(0).toUpperCase() + alimentoSelecionado.unit.slice(1)}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={quantidade}
                  min={modoUnidade ? 0.5 : 1}
                  step={modoUnidade ? 0.5 : 1}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-24 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-sm text-zinc-200 outline-none text-center"
                />
                <span className="text-xs text-zinc-600">
                  {modoUnidade
                    ? `${alimentoSelecionado.unit}(s) = ${Math.round(quantidade * alimentoSelecionado.gramsPerUnit)}g`
                    : "g"
                  }
                </span>
                <button
                  onClick={() => {
                    if (!alimentoSelecionado) return
                    const gramas = modoUnidade
                      ? quantidade * alimentoSelecionado.gramsPerUnit
                      : quantidade
                    const ratio = gramas / 100
                    dispatch({
                      type: "ADD_FOOD",
                      meal: refeicaoAtiva,
                      item: {
                        id: Date.now(),
                        name: alimentoSelecionado.name,
                        qty: modoUnidade
                          ? `${quantidade} ${alimentoSelecionado.unit}(s)`
                          : `${quantidade}g`,
                        cal: Math.round(alimentoSelecionado.cal * ratio),
                        p: Math.round(alimentoSelecionado.p * ratio * 10) / 10,
                        c: Math.round(alimentoSelecionado.c * ratio * 10) / 10,
                        f: Math.round(alimentoSelecionado.f * ratio * 10) / 10,
                      },
                    })
                    setAlimentoSelecionado(null)
                    setQuantidade(100)
                    setModoUnidade(false)
                  }}
                  className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-1.5 rounded-lg transition-all ml-auto"
                >
                  Adicionar
                </button>
              </div>

              {/* Preview dos macros */}
              {quantidade > 0 && (
                <div className="flex gap-3 pt-1">
                  {[
                    { lbl: "kcal", val: Math.round(alimentoSelecionado.cal * (modoUnidade ? quantidade * alimentoSelecionado.gramsPerUnit : quantidade) / 100), cor: "text-violet-400" },
                    { lbl: "prot", val: Math.round(alimentoSelecionado.p * (modoUnidade ? quantidade * alimentoSelecionado.gramsPerUnit : quantidade) / 100 * 10) / 10 + "g", cor: "text-emerald-400" },
                    { lbl: "carbs", val: Math.round(alimentoSelecionado.c * (modoUnidade ? quantidade * alimentoSelecionado.gramsPerUnit : quantidade) / 100 * 10) / 10 + "g", cor: "text-amber-400" },
                    { lbl: "gord", val: Math.round(alimentoSelecionado.f * (modoUnidade ? quantidade * alimentoSelecionado.gramsPerUnit : quantidade) / 100 * 10) / 10 + "g", cor: "text-rose-400" },
                  ].map((m) => (
                    <div key={m.lbl}>
                      <p className="text-[9px] text-zinc-700 uppercase">{m.lbl}</p>
                      <p className={`text-xs font-medium ${m.cor}`}>{m.val}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Itens adicionados na refeição ativa */}
          {logHoje[refeicaoAtiva]?.length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Adicionado em {refeicaoAtiva}</p>
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

      {/* PAINEL LATERAL — resumo das refeições */}
      <div className="w-64 flex-shrink-0 space-y-3 sticky top-6">
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-4">Resumo do dia</p>

          {!refeicaoTemItens ? (
            <p className="text-xs text-zinc-700 text-center py-4">Nenhuma refeição registrada ainda.</p>
          ) : (
            <div className="space-y-4">
              {REFEICOES.map((r) => {
                const items = logHoje[r] || []
                if (items.length === 0) return null
                const t = totaisRefeicao(r)
                return (
                  <div key={r}>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">{r}</p>
                    <div className="space-y-1 mb-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400 truncate flex-1">{item.name}</span>
                          <span className="text-[10px] text-zinc-600 ml-2 flex-shrink-0">{item.cal} kcal</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#0f0f0f] rounded-lg p-2 border border-[#2a2a2a]">
                      <div className="grid grid-cols-2 gap-1">
                        <div>
                          <p className="text-[9px] text-zinc-700 uppercase">Kcal</p>
                          <p className="text-xs text-violet-400 font-medium">{Math.round(t.cal)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-zinc-700 uppercase">Prot</p>
                          <p className="text-xs text-emerald-400 font-medium">{Math.round(t.p)}g</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-zinc-700 uppercase">Carbs</p>
                          <p className="text-xs text-amber-400 font-medium">{Math.round(t.c)}g</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-zinc-700 uppercase">Gord</p>
                          <p className="text-xs text-rose-400 font-medium">{Math.round(t.f)}g</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-[#2a2a2a] mt-3" />
                  </div>
                )
              })}

              {/* Total geral */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Total geral</p>
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[9px] text-zinc-600 uppercase">Kcal</p>
                      <p className="text-sm text-violet-400 font-semibold">{Math.round(totais.cal)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-600 uppercase">Proteína</p>
                      <p className="text-sm text-emerald-400 font-semibold">{Math.round(totais.p)}g</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-600 uppercase">Carbos</p>
                      <p className="text-sm text-amber-400 font-semibold">{Math.round(totais.c)}g</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-600 uppercase">Gordura</p>
                      <p className="text-sm text-rose-400 font-semibold">{Math.round(totais.f)}g</p>
                    </div>
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