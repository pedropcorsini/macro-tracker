import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import { useTranslation } from "react-i18next"
import "../styles/app.css"

const MESES = {
  pt: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  es: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
}
const DIAS_SEMANA = {
  pt: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
  en: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
  es: ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
}

function Calendario() {
  const { state } = useTracker()
  const { t, i18n } = useTranslation()
  const hoje = new Date()
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth())
  const [diaSelecionado, setDiaSelecionado] = useState(null)

  const isDark = document.documentElement.classList.contains("dark")
  const d = isDark

  const lang = i18n.language.startsWith("en") ? "en" : i18n.language.startsWith("es") ? "es" : "pt"
  const meses = MESES[lang]
  const diasSemana = DIAS_SEMANA[lang]

  function mudarMes(dir) {
    if (dir === 1 && mes === 11) { setMes(0); setAno(ano + 1) }
    else if (dir === -1 && mes === 0) { setMes(11); setAno(ano - 1) }
    else setMes(mes + dir)
    setDiaSelecionado(null)
  }

  function getChave(dd) {
    return `${ano}-${String(mes+1).padStart(2,"0")}-${String(dd).padStart(2,"0")}`
  }

  function getTotais(chave) {
    const log = state.logs[chave] || {}
    return Object.values(log).flat().reduce(
      (a, i) => ({ cal: a.cal+i.cal, p: a.p+i.p, c: a.c+i.c, f: a.f+i.f }),
      { cal:0, p:0, c:0, f:0 }
    )
  }

  function corPonto(chave) {
    const tt = getTotais(chave)
    if (tt.cal === 0) return null
    const pct = state.goals.cal > 0 ? tt.cal / state.goals.cal : 0
    if (pct >= 0.9 && pct <= 1.1) return "#34d399"
    if (pct >= 0.7) return "#fbbf24"
    return "#f87171"
  }

  function pctBadgeClass(val, meta) {
    const pct = meta > 0 ? Math.round(val / meta * 100) : 0
    if (pct >= 90 && pct <= 110) return "ok"
    if (pct >= 75) return "warn"
    return "bad"
  }

  const primeiroDia = new Date(ano, mes, 1).getDay()
  const totalDias = new Date(ano, mes+1, 0).getDate()
  const chaveSel = diaSelecionado ? getChave(diaSelecionado) : null
  const totaisDia = chaveSel ? getTotais(chaveSel) : null
  const aguaDia = chaveSel ? (state.waterLog[chaveSel] || 0) : 0

  return (
    <div style={{ maxWidth: "680px" }}>
      <div className="page-header">
        <div className="page-tag">Histórico</div>
        <h1 className={d?"page-title":"page-title light"}>{t("nav_calendar")}</h1>
        <p className="page-sub">{meses[mes]} {ano}</p>
      </div>

      <div className={d?"app-card":"app-card light"}>
        {/* Navegação */}
        <div className="cal-nav">
          <button className={d?"cal-nav-btn":"cal-nav-btn light"} onClick={() => mudarMes(-1)}>‹</button>
          <span className={d?"cal-nav-title":"cal-nav-title light"}>{meses[mes]} {ano}</span>
          <button className={d?"cal-nav-btn":"cal-nav-btn light"} onClick={() => mudarMes(1)}>›</button>
        </div>

        {/* Dias da semana */}
        <div className="cal-grid" style={{ marginBottom: "8px" }}>
          {diasSemana.map((dd) => (
            <div key={dd} className="cal-dow">{dd}</div>
          ))}
        </div>

        {/* Grade */}
        <div className="cal-grid">
          {Array.from({ length: primeiroDia }).map((_, i) => <div key={`v-${i}`} />)}
          {Array.from({ length: totalDias }).map((_, i) => {
            const dia = i + 1
            const chave = getChave(dia)
            const isHoje = dia===hoje.getDate() && mes===hoje.getMonth() && ano===hoje.getFullYear()
            const isSel = diaSelecionado === dia
            const ponto = corPonto(chave)
            const temAgua = (state.waterLog[chave] || 0) > 0
            return (
              <div
                key={dia}
                className={`cal-day${!d?" light":""}${isHoje?" today":""}${isSel?" selected":""}`}
                onClick={() => setDiaSelecionado(isSel ? null : dia)}
              >
                <div className="cal-day-num">{dia}</div>
                <div className="cal-dots">
                  {ponto && <div className="cal-dot" style={{ background: ponto }} />}
                  {temAgua && <div className="cal-dot" style={{ background: "#60a5fa" }} />}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legenda */}
        <div className={d?"cal-legend":"cal-legend light"}>
          {[
            { cor: "#34d399", texto: t("goal_reached_label") },
            { cor: "#fbbf24", texto: t("near_goal") },
            { cor: "#f87171", texto: t("below_goal") },
            { cor: "#60a5fa", texto: t("water_logged") },
          ].map((l) => (
            <div key={l.texto} className="cal-legend-item">
              <div className="cal-dot" style={{ background: l.cor, width: "7px", height: "7px" }} />
              {l.texto}
            </div>
          ))}
        </div>

        {/* Detalhe do dia */}
        {diaSelecionado && totaisDia && (
          <div className={d?"cal-detail":"cal-detail light"}>
            <div className="cal-detail-title">
              {String(diaSelecionado).padStart(2,"0")}/{String(mes+1).padStart(2,"0")}/{ano}
            </div>
            {totaisDia.cal === 0 && aguaDia === 0 ? (
              <p style={{ fontSize:"13px", color:"#52525b" }}>{t("no_data")}</p>
            ) : (
              <>
                {[
                  { label: t("calories"),     val: Math.round(totaisDia.cal), meta: state.goals.cal,   unit: "kcal" },
                  { label: t("protein"),      val: Math.round(totaisDia.p),   meta: state.goals.p,     unit: "g" },
                  { label: t("carbs"),        val: Math.round(totaisDia.c),   meta: state.goals.c,     unit: "g" },
                  { label: t("fat"),          val: Math.round(totaisDia.f),   meta: state.goals.f,     unit: "g" },
                  { label: t("water"),        val: aguaDia,                   meta: state.goals.water, unit: "ml" },
                ].map((item) => (
                  <div key={item.label} className={d?"cal-detail-row":"cal-detail-row light"}>
                    <span className="cal-detail-label">{item.label}</span>
                    <div style={{ display:"flex", alignItems:"center" }}>
                      <span className={d?"cal-detail-val":"cal-detail-val light"}>{item.val} {item.unit}</span>
                      <span className={`cal-pct-badge ${pctBadgeClass(item.val, item.meta)}`}>
                        {item.meta > 0 ? Math.round(item.val/item.meta*100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Calendario
