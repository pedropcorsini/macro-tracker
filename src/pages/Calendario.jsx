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

  function mudarMes(d) {
    if (d === 1 && mes === 11) { setMes(0); setAno(ano + 1) }
    else if (d === -1 && mes === 0) { setMes(11); setAno(ano - 1) }
    else setMes(mes + d)
    setDiaSelecionado(null)
  }

  function getChave(d) {
    return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
  }

  function getTotais(chave) {
    const log = state.logs[chave] || {}
    return Object.values(log).flat().reduce(
      (a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }),
      { cal: 0, p: 0, c: 0, f: 0 }
    )
  }

  function corPonto(chave) {
    const t = getTotais(chave)
    if (t.cal === 0) return null
    const pct = state.goals.cal > 0 ? t.cal / state.goals.cal : 0
    if (pct >= 0.9 && pct <= 1.1) return "bg-emerald-500"
    if (pct >= 0.7) return "bg-amber-500"
    return "bg-rose-500"
  }

  const primeiroDia = new Date(ano, mes, 1).getDay()
  const totalDias = new Date(ano, mes + 1, 0).getDate()
  const chaveSelecionada = diaSelecionado ? getChave(diaSelecionado) : null
  const totaisDia = chaveSelecionada ? getTotais(chaveSelecionada) : null
  const aguaDia = chaveSelecionada ? (state.waterLog[chaveSelecionada] || 0) : 0

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4">

        <div className="flex items-center justify-between mb-5">
          <button onClick={() => mudarMes(-1)} className="w-8 h-8 flex items-center justify-center border border-[#2a2a2a] rounded-lg text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all">‹</button>
          <span className="text-sm font-medium text-zinc-200">{MESES[mes]} {ano}</span>
          <button onClick={() => mudarMes(1)} className="w-8 h-8 flex items-center justify-center border border-[#2a2a2a] rounded-lg text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all">›</button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="text-center text-[10px] text-zinc-600 uppercase tracking-wider py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: primeiroDia }).map((_, i) => <div key={`v-${i}`} />)}
          {Array.from({ length: totalDias }).map((_, i) => {
            const dia = i + 1
            const chave = getChave(dia)
            const isHoje = dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()
            const isSel = diaSelecionado === dia
            const ponto = corPonto(chave)
            const temAgua = (state.waterLog[chave] || 0) > 0

            return (
              <div
                key={dia}
                onClick={() => setDiaSelecionado(isSel ? null : dia)}
                className={`rounded-lg p-1.5 min-h-12 text-center cursor-pointer border transition-all
                  ${isHoje ? "border-violet-500/50" : "border-transparent"}
                  ${isSel ? "bg-violet-500/10 border-violet-500/30" : "hover:bg-[#242424]"}
                `}
              >
                <p className={`text-sm font-medium ${isHoje ? "text-violet-400" : "text-zinc-400"}`}>{dia}</p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {ponto && <div className={`w-1.5 h-1.5 rounded-full ${ponto}`} />}
                  {temAgua && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-4 mt-4 pt-3 border-t border-[#2a2a2a] flex-wrap">
          {[
            { cor: "bg-emerald-500", texto: "Meta atingida" },
            { cor: "bg-amber-500", texto: "Perto da meta" },
            { cor: "bg-rose-500", texto: "Abaixo da meta" },
            { cor: "bg-blue-500", texto: "Água registrada" },
          ].map((l) => (
            <div key={l.texto} className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${l.cor}`} />
              <span className="text-xs text-zinc-600">{l.texto}</span>
            </div>
          ))}
        </div>

        {diaSelecionado && totaisDia && (
          <div className="mt-4 bg-[#0f0f0f] rounded-lg border border-[#2a2a2a] p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
              {String(diaSelecionado).padStart(2,"0")}/{String(mes+1).padStart(2,"0")}/{ano}
            </p>
            {totaisDia.cal === 0 && aguaDia === 0 ? (
              <p className="text-sm text-zinc-600">Nenhum dado registrado neste dia.</p>
            ) : (
              <div className="space-y-2.5">
                {[
                  { label: "Calorias", val: Math.round(totaisDia.cal), meta: state.goals.cal, unit: "kcal" },
                  { label: "Proteína", val: Math.round(totaisDia.p), meta: state.goals.p, unit: "g" },
                  { label: "Carboidratos", val: Math.round(totaisDia.c), meta: state.goals.c, unit: "g" },
                  { label: "Gordura", val: Math.round(totaisDia.f), meta: state.goals.f, unit: "g" },
                  { label: "Água", val: aguaDia, meta: state.goals.water, unit: "ml" },
                ].map((item) => {
                  const pct = item.meta > 0 ? Math.round(item.val / item.meta * 100) : 0
                  const cor = pct >= 90 && pct <= 110 ? "text-emerald-400 bg-emerald-500/10" : pct >= 75 ? "text-amber-400 bg-amber-500/10" : "text-rose-400 bg-rose-500/10"
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-300">{item.val} {item.unit}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cor}`}>{pct}%</span>
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