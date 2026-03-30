import { useState } from "react"
import { useTracker } from "../context/TrackerContext"

function Metas() {
  const { state, dispatch } = useTracker()
  const [form, setForm] = useState({ ...state.goals })
  const [salvo, setSalvo] = useState(false)

  function salvar() {
    dispatch({ type: "SET_GOALS", goals: { ...form } })
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  const campos = [
    { key: "cal", label: "Calorias", unit: "kcal" },
    { key: "p", label: "Proteína", unit: "g" },
    { key: "c", label: "Carboidratos", unit: "g" },
    { key: "f", label: "Gordura", unit: "g" },
    { key: "water", label: "Água", unit: "ml" },
    { key: "cupMl", label: "Tamanho do copo", unit: "ml por copo" },
  ]

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-6">Metas diárias</p>
        <div className="grid grid-cols-2 gap-5">
          {campos.map((campo) => (
            <div key={campo.key}>
              <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-2">{campo.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={form[campo.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [campo.key]: Number(e.target.value) }))}
                  className="w-32 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600 transition-all"
                />
                <span className="text-xs text-zinc-600">{campo.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={salvar}
          className={`mt-8 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            salvo
              ? "bg-emerald-600 text-white"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          }`}
        >
          {salvo ? "Salvo!" : "Salvar metas"}
        </button>
      </div>
    </div>
  )
}

export default Metas