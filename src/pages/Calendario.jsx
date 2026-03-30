import { useState } from "react"
import { useTracker } from "../context/TrackerContext"

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]

function Calendario() {
  const { state } = useTracker()
  const hoje = new Date()
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth())
  const [diaSelecionado, setDiaSelecionado] = useState(null)

  function mudarMes(direcao) {
    if (direcao === 1 && mes === 11) { setMes(0); setAno(ano + 1) }
    else if (direcao === -1 && mes === 0) { setMes(11); setAno(ano - 1) }
    else setMes(mes + direcao)
  }

  function getTotais(chave) {
    const log = state.logs[chave] || {}
    return Object.values(log).flat().reduce(
      (a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }),
      { cal: 0, p: 0, c: 0, f: 0 }
    )
  }

  function getChave(d) {
    return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
  }

  function corPonto(chave) {
    const t = getTotais(chave)
    if (t.cal === 0) return null
    const pct = state.goals.cal > 0 ? t.cal / state.goals.cal : 0
    if (pct >= 0.9 && pct <= 1.1) return "bg-green-400"
    if (pct >= 0.7) return "bg-amber-400"
    return "bg-red-400"
  }

  const primeiroDia = new Date(ano, mes, 1).getDay()
  const totalDias = new Date(ano, mes + 1, 0).getDate()

  const chaveSelecionada = diaSelecionado ? getChave(diaSelecionado) : null
  const totaisDia = chaveSelecionada ? getTotais(chaveSelecionada) : null
  const aguaDia = chaveSelecionada ? (state.waterLog[chaveSelecionada] || 0) : 0

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl border border-gray-100 p-4">

        {/* Navegação */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => mudarMes(-1)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">‹</button>
          <span className="text-sm font-medium text-gray-800">{MESES[mes]} {ano}</span>
          <button onClick={() => mudarMes(1)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">›</button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="text-center text-xs text-gray-400 uppercase py-1">{d}</div>
          ))}
        </div>

        {/* Grade de dias */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: primeiroDia }).map((_, i) => <div key={`v-${i}`} />)}
          {Array.from({ length: totalDias }).map((_, i) => {
            const dia = i + 1
            const chave = getChave(dia)
            const isHoje = dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()
            const isSelecionado = diaSelecionado === dia
            const ponto = corPonto(chave)
            const temAgua = (state.waterLog[chave] || 0) > 0

            return (
              <div
                key={dia}
                onClick={() => setDiaSelecionado(isSelecionado ? null : dia)}
                className={`rounded-lg p-1.5 min-h-12 text-center cursor-pointer border transition-all
                  ${isHoje ? "border-gray-400" : "border-transparent"}
                  ${isSelecionado ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"}
                `}
              >
                <p className="text-sm font-medium text-gray-700">{dia}</p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {ponto && <div className={`w-1.5 h-1.5 rounded-full ${ponto}`} />}
                  {temAgua && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legenda */}
        <div className="flex gap-4 mt-4 pt-3 border-t border-gray-50">
          {[
            { cor: "bg-green-400", texto: "Meta atingida" },
            { cor: "bg-amber-400", texto: "Perto da meta" },
            { cor: "bg-red-400", texto: "Abaixo da meta" },
            { cor: "bg-blue-400", texto: "Água registrada" },
          ].map((l) => (
            <div key={l.texto} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${l.cor}`} />
              <span className="text-xs text-gray-400">{l.texto}</span>
            </div>
          ))}
        </div>

        {/* Detalhe do dia */}
        {diaSelecionado && totaisDia && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">{String(diaSelecionado).padStart(2,"0")}/{String(mes+1).padStart(2,"0")}/{ano}</p>
            {totaisDia.cal === 0 && aguaDia === 0 ? (
              <p className="text-sm text-gray-400">Nenhum dado registrado neste dia.</p>
            ) : (
              <div className="space-y-2">
                {[
                  { label: "Calorias", val: Math.round(totaisDia.cal), meta: state.goals.cal, unit: "kcal" },
                  { label: "Proteína", val: Math.round(totaisDia.p), meta: state.goals.p, unit: "g" },
                  { label: "Carboidratos", val: Math.round(totaisDia.c), meta: state.goals.c, unit: "g" },
                  { label: "Gordura", val: Math.round(totaisDia.f), meta: state.goals.f, unit: "g" },
                  { label: "Água", val: aguaDia, meta: state.goals.water, unit: "ml" },
                ].map((item) => {
                  const pct = item.meta > 0 ? Math.round(item.val / item.meta * 100) : 0
                  const cor = pct >= 90 && pct <= 110 ? "text-green-600 bg-green-50" : pct >= 75 ? "text-amber-600 bg-amber-50" : "text-red-500 bg-red-50"
                  return (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800">{item.val} {item.unit}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cor}`}>{pct}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Calendario