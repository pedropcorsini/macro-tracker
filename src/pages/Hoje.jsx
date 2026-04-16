import { useState, useEffect, useRef } from "react"
import { useTracker } from "../context/TrackerContext"
import { buscarAlimentos } from "../services/usda"
import AlimentosRapidos from "../components/AlimentosRapidos"
import { useTranslation } from "react-i18next"
import "../styles/app.css"

function Hoje() {
  const { state, dispatch } = useTracker()
  const { t } = useTranslation()

  const REFEICOES = [t("meal_breakfast"), t("meal_lunch"), t("meal_snack"), t("meal_dinner")]

  const CONFIG_MACROS = [
    { key: "cal", lbl: t("calories"), unit: "kcal", color: "#a78bfa" },
    { key: "p",   lbl: t("protein"),  unit: "g",    color: "#34d399" },
    { key: "c",   lbl: t("carbs"),    unit: "g",    color: "#fbbf24" },
    { key: "f",   lbl: t("fat"),      unit: "g",    color: "#f87171" },
  ]

  const [refeicaoAtiva, setRefeicaoAtiva] = useState(REFEICOES[0])
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
    [t("meal_breakfast")]: [], [t("meal_lunch")]: [], [t("meal_snack")]: [], [t("meal_dinner")]: [],
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

  const isDark = document.documentElement.classList.contains("dark")
  const d = isDark

  useEffect(() => {
    if (busca.trim().length < 2) { setResultados([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setCarregando(true)
      try { const dados = await buscarAlimentos(busca); setResultados(dados) }
      catch { setResultados([]) }
      finally { setCarregando(false) }
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
    const gramas = modoUnidade ? quantidade * (alimentoSelecionado.gramsPerUnit || 100) : quantidade
    const ratio = gramas / 100
    dispatch({
      type: "ADD_FOOD", meal: refeicaoAtiva,
      item: {
        id: Date.now(), name: alimentoSelecionado.name,
        qty: modoUnidade ? `${quantidade} ${alimentoSelecionado.unit}(s)` : `${quantidade}g`,
        cal: Math.round(alimentoSelecionado.cal * ratio),
        p: Math.round(alimentoSelecionado.p * ratio * 10) / 10,
        c: Math.round(alimentoSelecionado.c * ratio * 10) / 10,
        f: Math.round(alimentoSelecionado.f * ratio * 10) / 10,
      },
    })
    setAlimentoSelecionado(null); setQuantidade(100); setModoUnidade(false)
  }

  function removerAlimento(id) { dispatch({ type: "REMOVE_FOOD", meal: refeicaoAtiva, id }) }

  function adicionarAgua() {
    const val = parseFloat(mlManual)
    if (!val || val <= 0) return
    dispatch({ type: "SET_WATER", amount: aguaHoje + (waterUnit === "L" ? val * 1000 : val) })
    setMlManual("")
  }

  function totaisRefeicao(r) {
    return (logHoje[r] || []).reduce(
      (a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }),
      { cal: 0, p: 0, c: 0, f: 0 }
    )
  }

  const refeicaoTemItens = REFEICOES.some((r) => (logHoje[r] || []).length > 0)
  const gramas = alimentoSelecionado ? (modoUnidade ? quantidade * (alimentoSelecionado.gramsPerUnit || 100) : quantidade) : 0

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

      {/* COLUNA PRINCIPAL */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* Macros */}
        <div className="macro-grid">
          {CONFIG_MACROS.map((m) => {
            const val = Math.round(totais[m.key])
            const meta = goals[m.key]
            const pct = meta > 0 ? Math.min(100, Math.round(val / meta * 100)) : 0
            return (
              <div key={m.key} className={d ? "macro-card" : "macro-card light"}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${m.color}, transparent)`, borderRadius: "16px 16px 0 0" }} />
                <div className="macro-card-label">{m.lbl}</div>
                <div className="macro-card-value" style={{ color: m.color }}>{val}</div>
                <div className="macro-card-meta">{t("of")} {meta} {m.unit}</div>
                <div className={d ? "macro-progress" : "macro-progress light"}>
                  <div className="macro-progress-fill" style={{ width: `${pct}%`, background: m.color }} />
                </div>
                <div className="macro-pct">{pct}%</div>
              </div>
            )
          })}
        </div>

        {/* Água */}
        <div className={d ? "app-card" : "app-card light"}>
          <div className="water-header">
            <span className="app-card-label" style={{ margin: 0 }}>{t("water_intake")}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#60a5fa" }}>{waterDisplay} / {waterMetaDisplay}</span>
              <div className={d ? "water-unit-toggle" : "water-unit-toggle light"}>
                {["ml","L"].map((u) => (
                  <button key={u} className={`water-unit-btn${!d?" light":""}${waterUnit===u?" active":""}`}
                    onClick={() => dispatch({ type: "SET_GOALS", goals: { ...goals, waterUnit: u } })}>{u}</button>
                ))}
              </div>
            </div>
          </div>
          <div className={d ? "water-bar" : "water-bar light"}>
            <div className="water-bar-fill" style={{ width: `${aguaPct}%` }} />
          </div>
          <div className="water-cups">
            {Array.from({ length: totalCopos }).map((_, i) => (
              <button key={i} className={`water-cup${!d?" light":""}${i<coposCheios?" filled":""}`}
                onClick={() => dispatch({ type: "SET_WATER", amount: (i<coposCheios?i:i+1)*goals.cupMl })}>{i+1}</button>
            ))}
            <span style={{ fontSize: "11px", color: "#3f3f46", marginLeft: "4px" }}>
              {goals.water - aguaHoje > 0
                ? `${t("missing")} ${waterUnit==="L"?((goals.water-aguaHoje)/1000).toFixed(1)+"L":(goals.water-aguaHoje)+"ml"}`
                : "✓ " + t("goal_reached")}
            </span>
          </div>
          <div className="water-input-row">
            <input type="number" value={mlManual} onChange={(e) => setMlManual(e.target.value)}
              onKeyDown={(e) => e.key==="Enter"&&adicionarAgua()}
              placeholder={t("water_manual")} className={d?"app-input":"app-input light"} style={{ flex:1 }} />
            <span style={{ fontSize:"12px", color:"#52525b" }}>{waterUnit}</span>
            <button className="app-btn-primary" onClick={adicionarAgua}
              style={{ background:"linear-gradient(135deg,#1d4ed8,#1e40af)", boxShadow:"0 0 20px rgba(29,78,216,0.2)" }}>
              {t("add")}</button>
            {aguaHoje > 0 && (
              <button className={d?"app-btn-secondary":"app-btn-secondary light"}
                onClick={() => dispatch({ type:"SET_WATER", amount:0 })} style={{ padding:"10px 12px", fontSize:"12px" }}>
                {t("water_reset")}</button>
            )}
          </div>
        </div>

        {/* Refeições */}
        <div className={d ? "app-card" : "app-card light"}>
          <div className="pill-tabs">
            {REFEICOES.map((r) => (
              <button key={r} className={`pill-tab${!d?" light":""}${refeicaoAtiva===r?" active":""}`}
                onClick={() => { setRefeicaoAtiva(r); setAlimentoSelecionado(null); setBusca(""); setResultados([]) }}>{r}</button>
            ))}
          </div>

          <div style={{ position:"relative", marginBottom:"12px" }}>
            <input type="text" placeholder={t("search_placeholder")} value={busca}
              onChange={(e) => { setBusca(e.target.value); setAlimentoSelecionado(null) }}
              className={d?"app-input":"app-input light"} />
            {carregando && (
              <div style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)",
                width:"16px", height:"16px", border:"2px solid #7c3aed", borderTopColor:"transparent",
                borderRadius:"50%", animation:"spin2 0.7s linear infinite" }} />
            )}
          </div>

          <AlimentosRapidos refeicaoAtiva={refeicaoAtiva} onAdicionar={() => {}} />

          {resultados.length > 0 && (
            <div className={d?"food-list-wrap":"food-list-wrap light"}>
              {resultados.map((f) => {
                const fav = state.favoritos.some((fv) => fv.name === f.name)
                return (
                  <div key={f.id} className={d?"food-item":"food-item light"} onClick={() => selecionarAlimento(f)}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className={d?"food-item-name":"food-item-name light"}>{f.name}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"3px" }}>
                        {f.fonte==="local"
                          ? <span className="food-item-badge local">{t("local_db")}</span>
                          : f.brand ? <span className="food-item-meta">{f.brand}</span>
                          : <span className="food-item-badge usda">USDA</span>}
                        <span className="food-item-meta">{f.cal} kcal · {f.p}g P · {f.c}g C · {f.f}g G</span>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
                      <button onClick={(e) => { e.stopPropagation(); dispatch({ type:"TOGGLE_FAVORITO", item:f }) }}
                        style={{ background:"none", border:"none", cursor:"pointer", fontSize:"15px", padding:0,
                          color: fav?"#ef4444":"#3f3f46", transition:"color 0.15s" }}>♥</button>
                      <span style={{ color:"#7c3aed", fontSize:"18px", fontWeight:300 }}>+</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {alimentoSelecionado && (
            <div className={d?"qty-row":"qty-row light"}>
              <span className={d?"qty-food-name":"qty-food-name light"}>{alimentoSelecionado.name}</span>
              {alimentoSelecionado.unit && (
                <div style={{ display:"flex", gap:"6px" }}>
                  <button className={`pill-tab${!d?" light":""}${!modoUnidade?" active":""}`}
                    style={{ fontSize:"11px", padding:"4px 10px" }}
                    onClick={() => { setModoUnidade(false); setQuantidade(100) }}>{t("grams")}</button>
                  <button className={`pill-tab${!d?" light":""}${modoUnidade?" active":""}`}
                    style={{ fontSize:"11px", padding:"4px 10px" }}
                    onClick={() => { setModoUnidade(true); setQuantidade(1) }}>
                    {alimentoSelecionado.unit.charAt(0).toUpperCase() + alimentoSelecionado.unit.slice(1)}</button>
                </div>
              )}
              <input type="number" value={quantidade} min={modoUnidade?0.5:1} step={modoUnidade?0.5:1}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className={d?"qty-input":"qty-input light"} />
              <span className="qty-unit">{modoUnidade?`${alimentoSelecionado.unit}(s) = ${Math.round(gramas)}g`:"g"}</span>
              {quantidade > 0 && (
                <div className="qty-preview">
                  {[
                    { lbl:"kcal", val:Math.round(alimentoSelecionado.cal*gramas/100), color:"#a78bfa" },
                    { lbl:"prot", val:(Math.round(alimentoSelecionado.p*gramas/100*10)/10)+"g", color:"#34d399" },
                    { lbl:"carbs", val:(Math.round(alimentoSelecionado.c*gramas/100*10)/10)+"g", color:"#fbbf24" },
                    { lbl:"gord", val:(Math.round(alimentoSelecionado.f*gramas/100*10)/10)+"g", color:"#f87171" },
                  ].map((m) => (
                    <div key={m.lbl}>
                      <div className="qty-preview-label">{m.lbl}</div>
                      <div className="qty-preview-val" style={{ color:m.color }}>{m.val}</div>
                    </div>
                  ))}
                </div>
              )}
              <button className="app-btn-primary" onClick={adicionarAlimento} style={{ marginLeft:"auto" }}>{t("add")}</button>
            </div>
          )}

          {logHoje[refeicaoAtiva]?.length > 0 && (
            <div>
              <div style={{ fontSize:"10px", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:"#52525b", marginBottom:"10px" }}>
                {t("added_to")} {refeicaoAtiva}
              </div>
              {logHoje[refeicaoAtiva].map((item) => (
                <div key={item.id} className={d?"added-item":"added-item light"}>
                  <div>
                    <div className={d?"added-item-name":"added-item-name light"}>
                      {item.name} <span className="added-item-qty">— {item.qty}</span>
                    </div>
                    <div className="added-item-macros">{item.cal} kcal · {item.p}g P · {item.c}g C · {item.f}g G</div>
                  </div>
                  <button className="added-remove-btn" onClick={() => removerAlimento(item.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PAINEL LATERAL */}
      <div style={{ width:"260px", flexShrink:0, position:"sticky", top:"24px" }}>
        <div className={d?"summary-panel":"summary-panel light"}>
          <div className="app-card-label">{t("day_summary")}</div>
          {!refeicaoTemItens ? (
            <div style={{ textAlign:"center", padding:"32px 0", color:"#3f3f46", fontSize:"13px" }}>{t("no_meals")}</div>
          ) : (
            <div>
              {REFEICOES.map((r) => {
                const items = logHoje[r] || []
                if (!items.length) return null
                const tot = totaisRefeicao(r)
                return (
                  <div key={r} style={{ marginBottom:"20px" }}>
                    <div className="summary-meal-title">{r}</div>
                    {items.map((item) => (
                      <div key={item.id} className="summary-item">
                        <span className="summary-item-name">{item.name}</span>
                        <span className="summary-item-cal">{item.cal} kcal</span>
                      </div>
                    ))}
                    <div className={d?"summary-macro-grid":"summary-macro-grid light"}>
                      {[
                        { lbl:"Kcal", val:Math.round(tot.cal), color:"#a78bfa" },
                        { lbl:"Prot", val:Math.round(tot.p)+"g", color:"#34d399" },
                        { lbl:"Carbs", val:Math.round(tot.c)+"g", color:"#fbbf24" },
                        { lbl:"Gord", val:Math.round(tot.f)+"g", color:"#f87171" },
                      ].map((m) => (
                        <div key={m.lbl}>
                          <div className="summary-macro-label">{m.lbl}</div>
                          <div className="summary-macro-val" style={{ color:m.color }}>{m.val}</div>
                        </div>
                      ))}
                    </div>
                    <div className={d?"summary-divider":"summary-divider light"} />
                  </div>
                )
              })}
              <div className={d?"summary-total":"summary-total light"}>
                <div className="summary-total-label">{t("total")}</div>
                <div className="summary-total-grid">
                  {[
                    { lbl:"Kcal", val:Math.round(totais.cal), color:"#a78bfa" },
                    { lbl:t("protein"), val:Math.round(totais.p)+"g", color:"#34d399" },
                    { lbl:t("carbs"), val:Math.round(totais.c)+"g", color:"#fbbf24" },
                    { lbl:t("fat"), val:Math.round(totais.f)+"g", color:"#f87171" },
                  ].map((m) => (
                    <div key={m.lbl}>
                      <div className="summary-total-label-item">{m.lbl}</div>
                      <div className="summary-total-val" style={{ color:m.color }}>{m.val}</div>
                    </div>
                  ))}
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
