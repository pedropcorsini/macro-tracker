import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import { useTranslation } from "react-i18next"

function Metas() {
  const { state, dispatch } = useTracker()
  const { t } = useTranslation()
  const [form, setForm] = useState({ ...state.goals })
  const [salvo, setSalvo] = useState(false)

  function salvar() {
    dispatch({ type: "SET_GOALS", goals: { ...form } })
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  const campos = [
    { key: "cal",   label: t("calories"),  unit: "kcal",           cor: "text-violet-500" },
    { key: "p",     label: t("protein"),   unit: "g",              cor: "text-emerald-500" },
    { key: "c",     label: t("carbs"),     unit: "g",              cor: "text-amber-500" },
    { key: "f",     label: t("fat"),       unit: "g",              cor: "text-rose-500" },
    { key: "water", label: t("water"),     unit: "ml",             cor: "text-blue-500" },
    { key: "cupMl", label: t("cup_size"),  unit: t("per_cup"),     cor: "text-blue-400" },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-6">
        <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6">{t("daily_goals")}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {campos.map((campo) => (
            <div key={campo.key}>
              <label className={`text-xs uppercase tracking-widest block mb-2 font-medium ${campo.cor}`}>{campo.label}</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={form[campo.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [campo.key]: Number(e.target.value) }))}
                  className="w-full sm:w-36 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-zinc-200 outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-all"
                />
                <span className="text-xs text-gray-300 dark:text-zinc-600 whitespace-nowrap">{campo.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="mt-6 bg-gray-50 dark:bg-[#0f0f0f] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-4">
          <p className="text-[10px] text-gray-300 dark:text-zinc-600 uppercase tracking-widest mb-3">{t("preview_goals")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { lbl: t("calories"), val: form.cal, unit: "kcal", cor: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
              { lbl: t("protein"),  val: form.p,   unit: "g",    cor: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
              { lbl: t("carbs"),    val: form.c,   unit: "g",    cor: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-500/10" },
              { lbl: t("fat"),      val: form.f,   unit: "g",    cor: "text-rose-500",    bg: "bg-rose-50 dark:bg-rose-500/10" },
            ].map((m) => (
              <div key={m.lbl} className={`rounded-lg p-3 ${m.bg}`}>
                <p className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-wider mb-1">{m.lbl}</p>
                <p className={`text-lg font-semibold ${m.cor}`}>{m.val}<span className="text-xs ml-1">{m.unit}</span></p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#2a2a2a] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-400 dark:text-zinc-500">{t("water")}: <span className="text-blue-500 font-medium">{form.water}ml</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-xs text-gray-400 dark:text-zinc-500">{t("cup_size")}: <span className="text-blue-400 font-medium">{form.cupMl}ml</span> · {Math.ceil(form.water / form.cupMl)} {t("cups_per_day")}</span>
            </div>
          </div>
        </div>

        <button
          onClick={salvar}
          className={`mt-6 w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-medium transition-all ${
            salvo ? "bg-emerald-600 text-white" : "bg-violet-600 hover:bg-violet-500 text-white"
          }`}
        >
          {salvo ? t("saved") : t("save_goals")}
        </button>
      </div>
    </div>
  )
}

export default Metas