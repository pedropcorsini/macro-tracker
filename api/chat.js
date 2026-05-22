const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: { message: "GROQ_API_KEY não configurada no servidor" } })
  }

  let body = req.body
  if (typeof body === "string") {
    try { body = JSON.parse(body) } catch { body = {} }
  }

  try {
    const groqRes = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    const data = await groqRes.json()
    return res.status(groqRes.status).json(data)
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } })
  }
}