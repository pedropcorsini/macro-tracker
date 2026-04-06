import foodsData from "../data/foods"
import i18n from "../i18n"

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

  const termo = query.toLowerCase().trim()
  const foods = getFoods()
  const locais = foods.filter((f) => f.name.toLowerCase().includes(termo))

  if (locais.length > 0) {
    return locais.map((f) => ({ ...f, fonte: "local" }))
  }

  try {
    const response = await fetch(
      `${BASE_URL}/foods/search?query=${encodeURIComponent(query)}&pageSize=20&api_key=${API_KEY}`
    )
    if (!response.ok) throw new Error("Erro na API")
    const data = await response.json()

    return data.foods.map((food) => ({
      id: food.fdcId,
      name: food.description,
      brand: food.brandOwner || null,
      cal: getNutrient(food, 1008),
      p: getNutrient(food, 1003),
      c: getNutrient(food, 1005),
      f: getNutrient(food, 1004),
      fonte: "usda",
    }))
  } catch {
    return []
  }
}

function getNutrient(food, id) {
  const nutrient = food.foodNutrients?.find((n) => n.nutrientId === id)
  return Math.round((nutrient?.value || 0) * 10) / 10
}