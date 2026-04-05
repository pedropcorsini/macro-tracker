import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import { useTranslation } from "react-i18next"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

const DIAS_SEMANA = {
  pt: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
  en: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
  es: ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
}
const MESES_CURTOS = {
  pt: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
  en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  es: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
}

function getChave(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`
}

function Graficos() {
  const { state } = useTracker()
  const { t, i18n } = useTranslation()
  const [periodo, setPeriodo] = useState("semana")
  const hoje = new Date()

  const lang = i18n.language.startsWith("en") ? "en" : i18n.language.startsWith("es") ? "es" : "pt"
  const diasSemana = DIAS_SEMANA[lang]
  const mesesCurtos = MESES_CURTOS[lang]

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
      const tt = getTotaisDia(getChave(d))
      return {
        nome: diasSemana[d.getDay()],
        [t("calories")]: Math.round(tt.cal),
        [t("protein")]: Math.round(tt.p),
        [t("carbs")]: Math.round(tt.c),
        [t("fat")]: Math.round(tt.f),
        [t("water")]: Math.round(tt.agua),
      }
    })
  }

  function dadosMes() {
    const totalDias = new Date(hoje.getFullYear(), hoje.getMonth()+1, 0).getDate()
    return Array.from({ length: totalDias }).map((_, i) => {
      const d = new Date(hoje.getFullYear(), hoje.getMonth(), i+1)
      const tt = getTotaisDia(getChave(d))
      return {
        nome: String(i+1),
        [t("calories")]: Math.round(tt.cal),
        [t("protein")]: Math.round(tt.p),
        [t("carbs")]: Math.round(tt.c),
        [t("fat")]: Math.round(tt.f),
        [t("water")]: Math.round(tt.agua),
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
    { titleKey: "calories", dataKey: t("calories"), cor: "#8b5cf6", meta: goals.cal, unit: "kcal" },
    { titleKey: "protein",  dataKey: t("protein"),  cor: "#10b981", meta: goals.p,   unit: "g" },
    { titleKey: "carbs",    dataKey: t("carbs"),    cor: "#f59e0b", meta: goals.c,   unit: "g" },
    { titleKey: "fat",      dataKey: t("fat"),      cor: "#f43f5e", meta: goals.f,   unit: "g" },
    { titleKey: "water",    dataKey: t("water"),    cor: "#3b82f6", meta: goals.water, unit: "ml" },
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
        <p style={{ fontSize: 11, color: cor, marginTop: 2 }}>{pct}% {t("of")} {t("goal_label").replace(":", "")} {meta}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-medium text-gray-800 dark:text-zinc-200">{t("charts_title")}</h2>
          <p className="text-xs text-gray-400 dark:text-zinc-600 mt-0.5">
            {periodo === "semana" ? t("last_7_days") : `${mesesCurtos[hoje.getMonth()]} ${hoje.getFullYear()}`}
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
              {p === "semana" ? t("week") : t("month")}
            </button>
          ))}
        </div>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {graficos.map((g) => {
          const comDados = dados.filter(d => (d[g.dataKey] || 0) > 0)
          const media = comDados.length > 0 ? Math.round(comDados.reduce((a, d) => a + (d[g.dataKey] || 0), 0) / comDados.length) : 0
          const pct = g.meta > 0 ? Math.min(100, Math.round(media / g.meta * 100)) : 0
          return (
            <div key={g.titleKey} className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-3">
              <p className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-1">{t(g.titleKey)}</p>
              <p className="text-lg font-semibold" style={{ color: g.cor }}>{media}</p>
              <p className="text-[10px] text-gray-300 dark:text-zinc-700">{t("avg_per_day")} · {pct}%</p>
              <div className="h-0.5 bg-gray-100 dark:bg-[#2a2a2a] rounded-full mt-2">
                <div className="h-0.5 rounded-full transition-all" style={{ width: `${pct}%`, background: g.cor }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Gráficos */}
      {graficos.map((g) => (
        <div key={g.titleKey} className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: g.cor }} />
              <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">{t(g.titleKey)}</p>
            </div>
            <span className="text-[10px] text-gray-300 dark:text-zinc-700 border border-gray-100 dark:border-[#2a2a2a] px-2 py-1 rounded-lg">
              {t("goal_label")} {g.meta} {g.unit}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dados} barSize={periodo === "mes" ? 6 : 28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="nome" tick={{ fontSize: 10, fill: textColor }} axisLine={false} tickLine={false} interval={periodo === "mes" ? 4 : 0} />
              <YAxis tick={{ fontSize: 10, fill: textColor }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip unit={g.unit} meta={g.meta} />} cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }} />
              <ReferenceLine y={g.meta} stroke={g.cor} strokeDasharray="4 4" strokeOpacity={0.4} strokeWidth={1.5} />
              <Bar dataKey={g.dataKey} fill={g.cor} radius={[4, 4, 0, 0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-gray-300 dark:text-zinc-700 mt-2 text-center">{t("dashed_line")}</p>
        </div>
      ))}
    </div>
  )
}

export default Graficos