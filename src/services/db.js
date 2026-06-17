import { supabase } from "./supabase"

export async function carregarPerfil(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error && error.code === "PGRST116") {
    const { data: novo } = await supabase
      .from("profiles")
      .insert({ id: userId })
      .select()
      .single()
    return novo
  }
  return data
}

export async function salvarGoals(userId, goals) {
  await supabase
    .from("profiles")
    .upsert({ id: userId, goals })
}

export async function carregarLog(userId, date) {
  const { data } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single()
  return data
}

export async function salvarLog(userId, date, meals, waterMl) {
  await supabase
    .from("daily_logs")
    .upsert({ user_id: userId, date, meals, water_ml: waterMl }, { onConflict: "user_id,date" })
}

export async function carregarTodosLogs(userId) {
  const { data } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
  return data || []
}

export async function carregarFavoritos(userId) {
  const { data } = await supabase
    .from("favoritos")
    .select("items")
    .eq("user_id", userId)
    .single()
  return data?.items || []
}

export async function salvarFavoritos(userId, items) {
  await supabase
    .from("favoritos")
    .upsert({ user_id: userId, items, updated_at: new Date().toISOString() }, { onConflict: "user_id" })
}