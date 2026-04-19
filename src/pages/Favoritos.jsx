import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import { useTranslation } from "react-i18next"
import "../styles/app.css"

export default function Favoritos() {
  const { state, dispatch } = useTracker()
  const { t } = useTranslation()
  const [quantidades, setQuantidades] = useState({})
  const [refeicaoAtiva, setRefeicaoAtiva] = useState("")
  const [adicionado, setAdicionado] = useState(null)

  const isDark = document.documentElement.classList.contains("dark")
  const d = isDark

  const REFEICOES = [t("meal_breakfast"), t("meal_lunch"), t("meal_snack"), t("meal_dinner")]
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
        id: Date.now(), name: item.name, qty: `${qty}g`,
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
    <div className="page-shell" style={{ maxWidth: "680px" }}>
      <div className="page-header">
        <div className="page-tag">Saved</div>
        <h1 className={d?"page-title":"page-title light"}>{t("favorites_title")}</h1>
        <p className="page-sub">{t("favorites_subtitle")}</p>
      </div>

      {/* Seletor de refeição */}
      <div className={d?"app-card":"app-card light"} style={{ marginBottom:"12px" }}>
        <div className="app-card-label">{t("add_to")}</div>
        <div className="pill-tabs" style={{ marginBottom: 0 }}>
          {REFEICOES.map((r) => (
            <button key={r}
              className={`pill-tab${!d?" light":""}${refeicaoSelecionada===r?" active":""}`}
              onClick={() => setRefeicaoAtiva(r)}>{r}</button>
          ))}
        </div>
      </div>

      {/* Lista de favoritos */}
      <div className={d?"app-card":"app-card light"}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
          <div className="app-card-label" style={{ margin:0, display:"flex", alignItems:"center", gap:"6px" }}>
            <span style={{ color:"#ef4444" }}>♥</span> {t("favorites")}
          </div>
          <span style={{ fontSize:"11px", color:"#52525b" }}>
            {state.favoritos.length} {t("items")}
          </span>
        </div>

        {state.favoritos.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <div style={{ fontSize:"40px", marginBottom:"12px", opacity:0.3 }}>♥</div>
            <p style={{ fontSize:"14px", color:"#52525b", marginBottom:"4px" }}>{t("no_favorites")}</p>
            <p style={{ fontSize:"12px", color:"#3f3f46" }}>
              {t("no_favorites")}
            </p>
          </div>
        ) : (
          <div>
            {state.favoritos.map((item) => {
              const qty = quantidades[item.name] || 100
              const ratio = qty / 100
              const foiAdicionado = adicionado === item.name
              return (
                <div key={item.name} className={d?"fav-item":"fav-item light"}>
                  <button className="fav-heart" onClick={() => toggleFavorito(item)}>♥</button>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className={d?"fav-name":"fav-name light"}>{item.name}</div>
                    <div className="fav-meta">
                      {Math.round(item.cal*ratio)} kcal · {Math.round(item.p*ratio*10)/10}g P · {Math.round(item.c*ratio*10)/10}g C · {Math.round(item.f*ratio*10)/10}g G
                    </div>
                  </div>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQuantidades((prev) => ({ ...prev, [item.name]: Number(e.target.value) }))}
                    className={d?"fav-qty-input":"fav-qty-input light"}
                  />
                  <span style={{ fontSize:"11px", color:"#52525b" }}>g</span>
                  <button
                    className={`fav-add-btn${foiAdicionado?" done":""}`}
                    onClick={() => adicionarRapido(item)}
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
