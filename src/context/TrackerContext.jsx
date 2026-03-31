import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { carregarPerfil, salvarGoals, salvarLog, carregarTodosLogs } from "../services/db"

const initialState = {
  goals: { cal: 2000, p: 150, c: 200, f: 65, water: 2500, cupMl: 250, waterUnit: "ml" },
  logs: {},
  waterLog: {},
  userId: null,
  carregado: false,
}

function getToday() {
  return new Date().toISOString().split("T")[0]
}

const REFEICOES_PADRAO = {
  "Café da manhã": [],
  "Almoço": [],
  "Lanche da tarde": [],
  "Jantar": [],
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

      const logsFormatado = {}
      const waterLogFormatado = {}
      logs.forEach((l) => {
        logsFormatado[l.date] = l.meals || { ...REFEICOES_PADRAO }
        waterLogFormatado[l.date] = l.water_ml || 0
      })

      dispatch({
        type: "INIT",
        payload: {
          goals: perfil?.goals || initialState.goals,
          logs: logsFormatado,
          waterLog: waterLogFormatado,
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
    } else {
      await salvarLog(
        userId,
        today,
        novoState.logs[today] || { ...REFEICOES_PADRAO },
        novoState.waterLog[today] || 0
      )
    }
  }, [userId])

  function dispatchComSync(action) {
    dispatch(action)
    setTimeout(() => {
      if (action.type === "SET_GOALS") {
        const novoState = reducer(state, action)
        salvarNuvem(novoState, "goals")
      } else if (["ADD_FOOD", "REMOVE_FOOD", "SET_WATER"].includes(action.type)) {
        const novoState = reducer(state, action)
        salvarNuvem(novoState, "log")
      }
    }, 100)
  }

  if (!state.carregado && userId) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] dark:bg-[#0f0f0f] flex items-center justify-center">
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