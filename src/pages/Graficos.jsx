import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import { useTranslation } from "react-i18next"
import "../styles/app.css"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts"

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

  const isDark = document.documentElement.classList.contains("dark")
  const d = isDark

  const lang = i18n.language.startsWith("en") ? "en" : i18n.language.startsWith("es") ? "es" : "pt"
  const diasSemana = DIAS_SEMANA[lang]
  const mesesCurtos = MESES_CURTOS[lang]

  function getTotaisDia(chave) {
    const log = state.logs[chave] || {}
    const macros = Object.values(log).flat().reduce(
      (a, i) => ({ cal:a.cal+i.cal, p:a.p+i.p, c:a.c+i.c, f:a.f+i.f }),
      { cal:0, p:0, c:0, f:0 }
    )
    return { ...macros, agua: state.waterLog[chave] || 0 }
  }

  function dadosSemana() {
    return Array.from({ length: 7 }).map((_, i) => {
      const dt = new Date(hoje); dt.setDate(hoje.getDate() - 6 + i)
      const tt = getTotaisDia(getChave(dt))
      return {
        nome: diasSemana[dt.getDay()],
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
      const dt = new Date(hoje.getFullYear(), hoje.getMonth(), i+1)
      const tt = getTotaisDia(getChave(dt))
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

  const gridColor = d ? "rgba(255,255,255,0.04)" : "#f0f0f0"
  const textColor = d ? "#52525b" : "#a1a1aa"
  const tooltipBg = d ? "#18181b" : "#ffffff"
  const tooltipBorder = d ? "rgba(255,255,255,0.08)" : "#f0f0f0"

  const graficos = [
    { titleKey:"calories", dataKey:t("calories"), cor:"#a78bfa", meta:goals.cal, unit:"kcal" },
    { titleKey:"protein",  dataKey:t("protein"),  cor:"#34d399", meta:goals.p,   unit:"g" },
    { titleKey:"carbs",    dataKey:t("carbs"),    cor:"#fbbf24", meta:goals.c,   unit:"g" },
    { titleKey:"fat",      dataKey:t("fat"),      cor:"#f87171", meta:goals.f,   unit:"g" },
    { titleKey:"water",    dataKey:t("water"),    cor:"#60a5fa", meta:goals.water, unit:"ml" },
  ]

  const CustomTooltip = ({ active, payload, label, unit, meta, cor }) => {
    if (!active || !payload?.length) return null
    const val = payload[0]?.value || 0
    const pct = meta > 0 ? Math.round(val / meta * 100) : 0
    const pctColor = pct >= 90 && pct <= 110 ? "#34d399" : pct >= 70 ? "#fbbf24" : "#f87171"
    return (
      <div style={{ background:tooltipBg, border:`1px solid ${tooltipBorder}`, borderRadius:"12px", padding:"10px 14px", boxShadow:"0 8px 24px rgba(0,0,0,0.3)" }}>
        <p style={{ fontSize:"11px", color:textColor, marginBottom:"4px" }}>{label}</p>
        <p style={{ fontSize:"16px", fontWeight:700, color:cor, letterSpacing:"-0.01em" }}>{val} {unit}</p>
        <p style={{ fontSize:"11px", color:pctColor, marginTop:"2px" }}>{pct}% {t("of")} {meta}</p>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="page-tag">Analytics</div>
        <h1 className={d?"page-title":"page-title light"}>{t("charts_title")}</h1>
        <p className="page-sub">{periodo==="semana" ? t("last_7_days") : `${mesesCurtos[hoje.getMonth()]} ${hoje.getFullYear()}`}</p>
      </div>

      {/* Header com toggle */}
      <div className="chart-header">
        <div className={d?"chart-toggle":"chart-toggle light"}>
          {["semana","mes"].map((p) => (
            <button key={p}
              className={`chart-toggle-btn${!d?" light":""}${periodo===p?" active":""}`}
              onClick={() => setPeriodo(p)}>
              {p==="semana" ? t("week") : t("month")}
            </button>
          ))}
        </div>
      </div>

      {/* Cards resumo */}
      <div className="chart-summary-grid">
        {graficos.map((g) => {
          const comDados = dados.filter(dd => (dd[g.dataKey]||0) > 0)
          const media = comDados.length > 0
            ? Math.round(comDados.reduce((a, dd) => a+(dd[g.dataKey]||0), 0) / comDados.length)
            : 0
          const pct = g.meta > 0 ? Math.min(100, Math.round(media/g.meta*100)) : 0
          return (
            <div key={g.titleKey} className={d?"chart-summary-card":"chart-summary-card light"}>
              <div className="chart-summary-label">{t(g.titleKey)}</div>
              <div className="chart-summary-val" style={{ color:g.cor }}>{media}</div>
              <div className="chart-summary-meta">{t("avg_per_day")} · {pct}%</div>
              <div style={{ height:"2px", background:d?"rgba(255,255,255,0.05)":"#f0f0f0", borderRadius:"99px", marginTop:"8px", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:g.cor, borderRadius:"99px", transition:"width 0.5s" }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Gráficos */}
      {graficos.map((g) => (
        <div key={g.titleKey} className={d?"chart-card":"chart-card light"}>
          <div className="chart-card-header">
            <div className={d?"chart-card-title":"chart-card-title light"}>
              <div className="chart-card-dot" style={{ background:g.cor }} />
              {t(g.titleKey)}
            </div>
            <span className={d?"chart-card-badge":"chart-card-badge light"}>
              {t("goal_label")} {g.meta} {g.unit}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dados} barSize={periodo==="mes"?6:24} margin={{ top:4, right:4, left:-24, bottom:0 }}>
              <CartesianGrid vertical={false} stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="nome" tick={{ fontSize:10, fill:textColor }} axisLine={false} tickLine={false} interval={periodo==="mes"?4:0} />
              <YAxis tick={{ fontSize:10, fill:textColor }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip unit={g.unit} meta={g.meta} cor={g.cor} />}
                cursor={{ fill: d?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.02)" }} />
              <ReferenceLine y={g.meta} stroke={g.cor} strokeDasharray="4 4" strokeOpacity={0.35} strokeWidth={1.5} />
              <Bar dataKey={g.dataKey} fill={g.cor} radius={[4,4,0,0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize:"10px", color:"#3f3f46", textAlign:"center", marginTop:"8px" }}>{t("dashed_line")}</p>
        </div>
      ))}
    </div>
  )
}

export default Graficos
