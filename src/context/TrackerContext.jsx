import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { carregarPerfil, salvarGoals, salvarLog, carregarTodosLogs, salvarFavoritos, carregarFavoritos } from "../services/db"

const initialState = {
  goals: { cal: 2000, p: 150, c: 200, f: 65, water: 2500, cupMl: 250, waterUnit: "ml" },
  logs: {},
  waterLog: {},
  favoritos: [],
  recentes: [],
  maisUsados: [],
  userId: null,
  carregado: false,
}

function getToday() {
  return new Date().toISOString().split("T")[0]
}

const REFEICOES_PADRAO = {
  "Café da manhã": [], "Almoço": [], "Lanche da tarde": [], "Jantar": [],
}

function atualizarRecentes(recentes, item) {
  const alimento = { id: item.id, name: item.name, cal: item.cal, p: item.p, c: item.c, f: item.f }
  const filtrado = recentes.filter((r) => r.name !== item.name)
  return [alimento, ...filtrado].slice(0, 10)
}

function atualizarMaisUsados(maisUsados, item) {
  const existente = maisUsados.find((r) => r.name === item.name)
  if (existente) {
    return maisUsados
      .map((r) => r.name === item.name ? { ...r, count: r.count + 1 } : r)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }
  return [...maisUsados, { id: item.id, name: item.name, cal: item.cal, p: item.p, c: item.c, f: item.f, count: 1 }]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

function reducer(state, action) {
  const today = getToday()
  switch (action.type) {
    case "INIT":
      return { ...state, ...action.payload, carregado: true }

    case "ADD_FOOD": {
      const dayLog = state.logs[today] || { ...REFEICOES_PADRAO }
      return {
        ...state,
        logs: {
          ...state.logs,
          [today]: { ...dayLog, [action.meal]: [...(dayLog[action.meal] || []), action.item] },
        },
        recentes: atualizarRecentes(state.recentes, action.item),
        maisUsados: atualizarMaisUsados(state.maisUsados, action.item),
      }
    }

    case "REMOVE_FOOD": {
      const dayLog = state.logs[today] || { ...REFEICOES_PADRAO }
      return {
        ...state,
        logs: {
          ...state.logs,
          [today]: { ...dayLog, [action.meal]: (dayLog[action.meal] || []).filter((i) => i.id !== action.id) },
        },
      }
    }

    case "SET_WATER":
      return { ...state, waterLog: { ...state.waterLog, [today]: action.amount } }

    case "SET_GOALS":
      return { ...state, goals: action.goals }

    case "TOGGLE_FAVORITO": {
      const existe = state.favoritos.find((f) => f.name === action.item.name)
      const novosFavoritos = existe
        ? state.favoritos.filter((f) => f.name !== action.item.name)
        : [{ id: action.item.id, name: action.item.name, cal: action.item.cal, p: action.item.p, c: action.item.c, f: action.item.f }, ...state.favoritos]
      return { ...state, favoritos: novosFavoritos }
    }

    default:
      return state
  }
}

const TrackerContext = createContext(null)

export function TrackerProvider({ children, userId }) {
  const [state, dispatch] = useReducer(reducer, { ...initialState, userId })

  useEffect(() => {
    if (!userId) return
    async function init() {
      const perfil = await carregarPerfil(userId)
      const logs = await carregarTodosLogs(userId)
      const favoritosData = await carregarFavoritos(userId)

      const logsFormatado = {}
      const waterLogFormatado = {}
      logs.forEach((l) => {
        logsFormatado[l.date] = l.meals || { ...REFEICOES_PADRAO }
        waterLogFormatado[l.date] = l.water_ml || 0
      })

      // Calcular recentes e mais usados a partir dos logs
      const todosItens = logs.flatMap((l) => Object.values(l.meals || {}).flat())
      const recentes = []
      const maisUsadosMap = {}
      todosItens.forEach((item) => {
        if (!recentes.find((r) => r.name === item.name)) {
          recentes.push({ id: item.id, name: item.name, cal: item.cal, p: item.p, c: item.c, f: item.f })
        }
        if (maisUsadosMap[item.name]) {
          maisUsadosMap[item.name].count++
        } else {
          maisUsadosMap[item.name] = { id: item.id, name: item.name, cal: item.cal, p: item.p, c: item.c, f: item.f, count: 1 }
        }
      })

      dispatch({
        type: "INIT",
        payload: {
          goals: perfil?.goals || initialState.goals,
          logs: logsFormatado,
          waterLog: waterLogFormatado,
          favoritos: favoritosData || [],
          recentes: recentes.slice(0, 10),
          maisUsados: Object.values(maisUsadosMap).sort((a, b) => b.count - a.count).slice(0, 10),
          userId,
        },
      })
    }
    init()
  }, [userId])

  const salvarNuvem = useCallback(async (novoState, tipo) => {
    if (!userId) return
    const today = getToday()
    if (tipo === "goals") {
      await salvarGoals(userId, novoState.goals)
    } else if (tipo === "favoritos") {
      await salvarFavoritos(userId, novoState.favoritos)
    } else {
      await salvarLog(userId, today, novoState.logs[today] || { ...REFEICOES_PADRAO }, novoState.waterLog[today] || 0)
    }
  }, [userId])

  function dispatchComSync(action) {
    dispatch(action)
    setTimeout(() => {
      const novoState = reducer(state, action)
      if (action.type === "SET_GOALS") salvarNuvem(novoState, "goals")
      else if (action.type === "TOGGLE_FAVORITO") salvarNuvem(novoState, "favoritos")
      else if (["ADD_FOOD", "REMOVE_FOOD", "SET_WATER"].includes(action.type)) salvarNuvem(novoState, "log")
    }, 100)
  }

  if (!state.carregado && userId) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-600 uppercase tracking-widest">Carregando seus dados...</p>
        </div>
      </div>
    )
  }

  return (
    <TrackerContext.Provider value={{ state, dispatch: dispatchComSync }}>
      {children}
    </TrackerContext.Provider>
  )
}

export function useTracker() {
  return useContext(TrackerContext)
}