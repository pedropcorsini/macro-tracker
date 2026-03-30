import foods from "../data/foods"

const API_KEY = import.meta.env.VITE_USDA_API_KEY
const BASE_URL = "https://api.nal.usda.gov/fdc/v1"

export async function buscarAlimentos(query) {
  if (!query || query.trim().length < 2) return []

  // Busca no banco local primeiro
  const termo = query.toLowerCase().trim()
  const locais = foods.filter((f) =>
    f.name.toLowerCase().includes(termo)
  )

  if (locais.length > 0) {
    return locais.map((f) => ({ ...f, fonte: "local" }))
  }

  // Se não achou localmente, busca na API USDA
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