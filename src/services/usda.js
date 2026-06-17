import foodsData from "../data/foods"
import i18n from "../i18n"

const BASE_URL = "https://api.nal.usda.gov/fdc/v1"
const DEV_PROXY_URL = "/api/usda"
const LOCAL_RESULT_LIMIT = 80
const USDA_URL = import.meta.env.DEV ? DEV_PROXY_URL : BASE_URL
const API_KEY = import.meta.env.VITE_USDA_API_KEY

function getLang() {
  const lang = i18n.language || "pt"
  if (lang.startsWith("en")) return "en"
  if (lang.startsWith("es")) return "es"
  return "pt"
}

export function getFoods() {
  return foodsData[getLang()] || foodsData.pt
}

export async function buscarAlimentos(query) {
  if (!query || query.trim().length < 2) return []

  const termo = normalizeSearch(query)
  const localMatches = getSearchFoods()
    .map((food) => ({ food, ...getLocalSearchMatch(food, termo) }))
    .filter((item) => item.score > 0)

  const autocompleteMatches = localMatches.filter((item) => item.isPrefixMatch)
  const searchableMatches = autocompleteMatches.length > 0 ? autocompleteMatches : localMatches
  const locais = searchableMatches
    .sort((a, b) => b.score - a.score || a.food.name.localeCompare(b.food.name))
    .map(({ food }) => food)
    .map((f) => ({ ...f, fonte: "local" }))
    .slice(0, LOCAL_RESULT_LIMIT)

  if (locais.length > 0 || (!API_KEY && !import.meta.env.DEV)) return locais

  try {
    const response = await fetch(buildSearchUrl(query))
    if (!response.ok) throw new Error("Erro na API")
    const data = await response.json()

    const usda = (data.foods || []).map((food) => ({
      id: food.fdcId,
      name: food.description,
      brand: food.brandOwner || null,
      cal: getNutrient(food, 1008),
      p: getNutrient(food, 1003),
      c: getNutrient(food, 1005),
      f: getNutrient(food, 1004),
      fonte: "usda",
    }))

    return deduplicarAlimentos([...locais, ...usda])
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Falha ao buscar alimentos na USDA", error)
    }

    return locais
  }
}

function getNutrient(food, id) {
  const nutrient = food.foodNutrients?.find((n) => n.nutrientId === id)
  return Math.round((nutrient?.value || 0) * 10) / 10
}

function getSearchFoods() {
  const lang = getLang()
  const orderedLists = [
    foodsData[lang] || [],
    ...Object.entries(foodsData)
      .filter(([key]) => key !== lang)
      .map(([, foods]) => foods),
  ]
  const vistos = new Set()

  return orderedLists.flat().filter((food) => {
    const key = `${food.id}-${food.name}`.toLowerCase()
    if (vistos.has(key)) return false

    vistos.add(key)
    return true
  })
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function getLocalSearchMatch(food, query) {
  const fields = [food.name, ...(food.aliases || [])].map(normalizeSearch)
  const queryTerms = query.split(/\s+/).filter(Boolean)
  let score = 0
  let allTermsHavePrefix = true

  for (const term of queryTerms) {
    let termScore = 0
    let termHasPrefix = false

    for (const field of fields) {
      const words = field.split(/[^a-z0-9]+/).filter(Boolean)
      if (field.startsWith(term)) {
        termScore = Math.max(termScore, 120)
        termHasPrefix = true
      }
      if (words.some((word) => word.startsWith(term))) {
        termScore = Math.max(termScore, 90)
        termHasPrefix = true
      }
      if (field.includes(term)) termScore = Math.max(termScore, 40)
    }

    if (termScore === 0) return { score: 0, isPrefixMatch: false }
    if (!termHasPrefix) allTermsHavePrefix = false
    score += termScore
  }

  return { score, isPrefixMatch: allTermsHavePrefix }
}

function buildSearchUrl(query) {
  const params = new URLSearchParams({
    query,
    pageSize: "20",
  })

  if (!import.meta.env.DEV && API_KEY) {
    params.set("api_key", API_KEY)
  }

  return `${USDA_URL}/foods/search?${params.toString()}`
}

function deduplicarAlimentos(foods) {
  const vistos = new Set()

  return foods.filter((food) => {
    const key = `${food.name}-${food.brand || ""}`.toLowerCase()
    if (vistos.has(key)) return false

    vistos.add(key)
    return true
  })
}
