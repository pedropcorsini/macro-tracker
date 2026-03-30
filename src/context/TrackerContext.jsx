import { createContext, useContext, useReducer } from "react"

const initialState = {
  goals: { cal: 2000, p: 150, c: 200, f: 65, water: 2500, cupMl: 250 },
  logs: {},
  waterLog: {},
}

function getToday() {
  return new Date().toISOString().split("T")[0]
}

function reducer(state, action) {
  const today = getToday()

  switch (action.type) {
    case "ADD_FOOD": {
      const dayLog = state.logs[today] || {
        "Café da manhã": [],
        "Almoço": [],
        "Lanche da tarde": [],
        "Jantar": [],
      }
      return {
        ...state,
        logs: {
          ...state.logs,
          [today]: {
            ...dayLog,
            [action.meal]: [...dayLog[action.meal], action.item],
          },
        },
      }
    }

    case "REMOVE_FOOD": {
      const dayLog = state.logs[today]
      return {
        ...state,
        logs: {
          ...state.logs,
          [today]: {
            ...dayLog,
            [action.meal]: dayLog[action.meal].filter((i) => i.id !== action.id),
          },
        },
      }
    }

    case "SET_WATER":
      return {
        ...state,
        waterLog: { ...state.waterLog, [today]: action.amount },
      }

    case "SET_GOALS":
      return { ...state, goals: action.goals }

    default:
      return state
  }
}

const TrackerContext = createContext(null)

export function TrackerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <TrackerContext.Provider value={{ state, dispatch }}>
      {children}
    </TrackerContext.Provider>
  )
}

export function useTracker() {
  return useContext(TrackerContext)
}