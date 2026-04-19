import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import { useTranslation } from "react-i18next"

export default function AlimentosRapidos({ refeicaoAtiva, onAdicionar }) {
  const { state, dispatch } = useTracker()
  const { t } = useTranslation()
  const [quantidades, setQuantidades] = useState({})

  const favoritos = state.favoritos
  const isDark = document.documentElement.classList.contains("dark")
  const d = isDark

  function toggleFavorito(item) {
    dispatch({ type: "TOGGLE_FAVORITO", item })
  }

  function isFavorito(name) {
    return state.favoritos.some((f) => f.name === name)
  }

  function adicionarRapido(item) {
    const qty = quantidades[item.name] || 100
    const ratio = qty / 100
    dispatch({
      type: "ADD_FOOD",
      meal: refeicaoAtiva,
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
    if (onAdicionar) onAdicionar()
  }

  if (favoritos.length === 0) return null

  return (
    <div className={d ? "quick-access" : "quick-access light"}>
      <div className="quick-access-header">
        <div className="quick-access-label" style={{ marginBottom: 0 }}>
          <span style={{ color: "#ef4444" }}>♥</span>
          {t("favorites")}
        </div>
        <span className="quick-access-count">({favoritos.length})</span>
      </div>

      <div className="quick-access-list">
        {favoritos.map((item) => {
          const qty = quantidades[item.name] || 100
          const ratio = qty / 100
          const fav = isFavorito(item.name)

          return (
            <div key={item.name} className={d ? "fav-item" : "fav-item light"}>
              <button className="fav-heart" onClick={() => toggleFavorito(item)}>
                {fav ? "♥" : "♡"}
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={d ? "fav-name" : "fav-name light"}>{item.name}</div>
                <div className="fav-meta">
                  {Math.round(item.cal * ratio)} kcal · {Math.round(item.p * ratio * 10) / 10}g P
                </div>
              </div>

              <input
                type="number"
                value={qty}
                onChange={(e) => setQuantidades((prev) => ({ ...prev, [item.name]: Number(e.target.value) }))}
                className={d ? "fav-qty-input" : "fav-qty-input light"}
              />
              <span className="quick-access-unit">g</span>

              <button className="fav-add-btn" onClick={() => adicionarRapido(item)}>
                +
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
