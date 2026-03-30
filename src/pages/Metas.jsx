import { useState } from "react"
import { useTracker } from "../context/TrackerContext"

function Metas() {
  const { state, dispatch } = useTracker()
  const { goals } = state

  const [form, setForm] = useState({ ...goals })

  function salvar() {
    dispatch({ type: "SET_GOALS", goals: { ...form } })
    alert("Metas salvas com sucesso!")
  }

  function atualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: Number(valor) }))
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
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-base font-medium text-gray-800 mb-6">Metas diárias</h2>

        <div className="grid grid-cols-2 gap-4">
          {campos.map((campo) => (
            <div key={campo.key} className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500">{campo.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={form[campo.key]}
                  onChange={(e) => atualizar(campo.key, e.target.value)}
                  className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-gray-400"
                />
                <span className="text-sm text-gray-400">{campo.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={salvar}
          className="mt-6 bg-gray-800 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-all"
        >
          Salvar metas
        </button>
      </div>
    </div>
  )
}

export default Metas