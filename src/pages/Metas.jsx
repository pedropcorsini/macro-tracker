import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import { useTema } from "../context/ThemeContext"
import { useTranslation } from "react-i18next"
import "../styles/app.css"

function Metas() {
  const { state, dispatch } = useTracker()
  const { isDark } = useTema()
  const { t } = useTranslation()
  const [form, setForm] = useState({ ...state.goals })
  const [salvo, setSalvo] = useState(false)

  const d = isDark

  function salvar() {
    dispatch({ type: "SET_GOALS", goals: { ...form } })
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  const campos = [
    { key: "cal",   label: t("calories"),  unit: "kcal",        color: "#a78bfa" },
    { key: "p",     label: t("protein"),   unit: "g",           color: "#34d399" },
    { key: "c",     label: t("carbs"),     unit: "g",           color: "#fbbf24" },
    { key: "f",     label: t("fat"),       unit: "g",           color: "#f87171" },
    { key: "water", label: t("water"),     unit: "ml",          color: "#60a5fa" },
    { key: "cupMl", label: t("cup_size"),  unit: t("per_cup"),  color: "#818cf8" },
  ]

  return (
    <div className="page-shell" style={{ maxWidth: "720px" }}>
      <div className="page-header">
        <div className="page-tag">Config</div>
        <h1 className={d ? "page-title" : "page-title light"}>{t("daily_goals")}</h1>
        <p className="page-sub">{t("cup_size")} · {t("water")} · Macros</p>
      </div>

      <div className={d ? "app-card" : "app-card light"}>
        <div className="goals-grid">
          {campos.map((campo) => (
            <div key={campo.key}>
              <label className="goals-field-label" style={{ color: campo.color }}>{campo.label}</label>
              <div className="goals-input-row">
                <input
                  type="number"
                  value={form[campo.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [campo.key]: Number(e.target.value) }))}
                  className={d ? "goals-input" : "goals-input light"}
                />
                <span className="goals-unit">{campo.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className={d ? "goals-preview" : "goals-preview light"}>
          {[
            { lbl: t("calories"), val: form.cal, unit: "kcal", color: "#a78bfa" },
            { lbl: t("protein"),  val: form.p,   unit: "g",    color: "#34d399" },
            { lbl: t("carbs"),    val: form.c,   unit: "g",    color: "#fbbf24" },
            { lbl: t("fat"),      val: form.f,   unit: "g",    color: "#f87171" },
          ].map((m) => (
            <div key={m.lbl} className="goals-preview-item">
              <div className="goals-preview-val" style={{ color: m.color }}>{m.val}</div>
              <div className="goals-preview-label">{m.lbl}<br /><span style={{ color: "#3f3f46" }}>{m.unit}</span></div>
            </div>
          ))}
        </div>

        {/* Água info */}
        <div style={{
          display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "16px",
          padding: "14px 16px", background: d ? "rgba(59,130,246,0.06)" : "#eff6ff",
          border: `1px solid ${d ? "rgba(59,130,246,0.15)" : "#bfdbfe"}`,
          borderRadius: "12px"
        }}>
          {[
            { label: t("water"), val: `${form.water}ml`, color: "#60a5fa" },
            { label: t("cup_size"), val: `${form.cupMl}ml`, color: "#818cf8" },
            { label: t("cups_per_day"), val: `${Math.ceil(form.water / form.cupMl)} ${t("cups")}`, color: "#34d399" },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: "10px", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>{item.label}</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: item.color }}>{item.val}</div>
            </div>
          ))}
        </div>

        <button
          className={`goals-save-btn${salvo ? " saved" : ""}`}
          onClick={salvar}
        >
          {salvo ? "✓ " + t("saved") : t("save_goals")}
        </button>
      </div>
    </div>
  )
}

export default Metas
