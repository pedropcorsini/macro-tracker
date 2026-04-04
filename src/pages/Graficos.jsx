import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from "recharts"

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

function getChave(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`
}

function Graficos() {
  const { state } = useTracker()
  const [periodo, setPeriodo] = useState("semana")
  const hoje = new Date()

  function getTotaisDia(chave) {
    const log = state.logs[chave] || {}
    const macros = Object.values(log).flat().reduce(
      (a, i) => ({ cal: a.cal+i.cal, p: a.p+i.p, c: a.c+i.c, f: a.f+i.f }),
      { cal: 0, p: 0, c: 0, f: 0 }
    )
    return { ...macros, agua: state.waterLog[chave] || 0 }
  }

  function dadosSemana() {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(hoje)
      d.setDate(hoje.getDate() - 6 + i)
      const chave = getChave(d)
      const t = getTotaisDia(chave)
      return {
        nome: DIAS_SEMANA[d.getDay()],
        Calorias: Math.round(t.cal),
        Proteína: Math.round(t.p),
        Carbs: Math.round(t.c),
        Gordura: Math.round(t.f),
        Água: Math.round(t.agua),
        isHoje: i === 6,
      }
    })
  }

  function dadosMes() {
    const ano = hoje.getFullYear()
    const mes = hoje.getMonth()
    const totalDias = new Date(ano, mes+1, 0).getDate()
    return Array.from({ length: totalDias }).map((_, i) => {
      const d = new Date(ano, mes, i+1)
      const chave = getChave(d)
      const t = getTotaisDia(chave)
      return {
        nome: String(i+1),
        Calorias: Math.round(t.cal),
        Proteína: Math.round(t.p),
        Carbs: Math.round(t.c),
        Gordura: Math.round(t.f),
        Água: Math.round(t.agua),
        isHoje: d.getDate() === hoje.getDate(),
      }
    })
  }

  const dados = periodo === "semana" ? dadosSemana() : dadosMes()
  const { goals } = state

  const isDark = document.documentElement.classList.contains("dark")
  const gridColor = isDark ? "#2a2a2a" : "#f0f0f0"
  const textColor = isDark ? "#71717a" : "#9ca3af"
  const tooltipBg = isDark ? "#1a1a1a" : "#ffffff"
  const tooltipBorder = isDark ? "#2a2a2a" : "#e5e7eb"

  const graficos = [
    {
      title: "Calorias",
      dataKey: "Calorias",
      cor: "#8b5cf6",
      meta: goals.cal,
      unit: "kcal",
      metaLabel: `Meta: ${goals.cal} kcal`,
    },
    {
      title: "Proteína",
      dataKey: "Proteína",
      cor: "#10b981",
      meta: goals.p,
      unit: "g",
      metaLabel: `Meta: ${goals.p}g`,
    },
    {
      title: "Carboidratos",
      dataKey: "Carbs",
      cor: "#f59e0b",
      meta: goals.c,
      unit: "g",
      metaLabel: `Meta: ${goals.c}g`,
    },
    {
      title: "Gordura",
      dataKey: "Gordura",
      cor: "#f43f5e",
      meta: goals.f,
      unit: "g",
      metaLabel: `Meta: ${goals.f}g`,
    },
    {
      title: "Água",
      dataKey: "Água",
      cor: "#3b82f6",
      meta: goals.water,
      unit: "ml",
      metaLabel: `Meta: ${goals.water}ml`,
    },
  ]

  const CustomTooltip = ({ active, payload, label, unit, meta }) => {
    if (!active || !payload?.length) return null
    const val = payload[0]?.value || 0
    const pct = meta > 0 ? Math.round(val / meta * 100) : 0
    const cor = pct >= 90 && pct <= 110 ? "#10b981" : pct >= 70 ? "#f59e0b" : "#f43f5e"
    return (
      <div style={{ background: tooltipBg, border: `0.5px solid ${tooltipBorder}`, borderRadius: 10, padding: "10px 14px" }}>
        <p style={{ fontSize: 11, color: textColor, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 15, fontWeight: 600, color: payload[0]?.fill }}>{val} {unit}</p>
        <p style={{ fontSize: 11, color: cor, marginTop: 2 }}>{pct}% da meta</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Header + toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-200">Gráficos</h2>
          <p className="text-xs text-gray-400 dark:text-zinc-600 mt-0.5">
            {periodo === "semana" ? "Últimos 7 dias" : `${MESES[hoje.getMonth()]} ${hoje.getFullYear()}`}
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-[#1a1a1a] rounded-xl p-1 border border-gray-200 dark:border-[#2a2a2a]">
          {["semana", "mes"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                periodo === p
                  ? "bg-white dark:bg-[#2a2a2a] text-violet-600 dark:text-violet-400 shadow-sm"
                  : "text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400"
              }`}
            >
              {p === "semana" ? "Semana" : "Mês"}
            </button>
          ))}
        </div>
      </div>

      {/* Resumo rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {graficos.map((g) => {
          const total = dados.reduce((a, d) => a + (d[g.dataKey] || 0), 0)
          const media = dados.filter(d => d[g.dataKey] > 0).length > 0
            ? Math.round(total / dados.filter(d => d[g.dataKey] > 0).length)
            : 0
          const pct = g.meta > 0 ? Math.min(100, Math.round(media / g.meta * 100)) : 0
          return (
            <div key={g.title} className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-3">
              <p className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-1">{g.title}</p>
              <p className="text-lg font-semibold" style={{ color: g.cor }}>{media}</p>
              <p className="text-[10px] text-gray-300 dark:text-zinc-700">média/dia · {pct}%</p>
              <div className="h-0.5 bg-gray-100 dark:bg-[#2a2a2a] rounded-full mt-2">
                <div className="h-0.5 rounded-full transition-all" style={{ width: `${pct}%`, background: g.cor }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-4">
        {graficos.map((g) => (
          <div key={g.title} className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: g.cor }} />
                <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">{g.title}</p>
              </div>
              <span className="text-[10px] text-gray-300 dark:text-zinc-700 border border-gray-100 dark:border-[#2a2a2a] px-2 py-1 rounded-lg">
                {g.metaLabel}
              </span>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dados} barSize={periodo === "mes" ? 6 : 28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={gridColor} strokeDasharray="3 3" />
                <XAxis
                  dataKey="nome"
                  tick={{ fontSize: 10, fill: textColor }}
                  axisLine={false}
                  tickLine={false}
                  interval={periodo === "mes" ? 4 : 0}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: textColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip unit={g.unit} meta={g.meta} />} cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }} />
                <ReferenceLine
                  y={g.meta}
                  stroke={g.cor}
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                  strokeWidth={1.5}
                />
                <Bar
                  dataKey={g.dataKey}
                  fill={g.cor}
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>

            <p className="text-[10px] text-gray-300 dark:text-zinc-700 mt-2 text-center">
              linha tracejada = meta diária
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Graficos