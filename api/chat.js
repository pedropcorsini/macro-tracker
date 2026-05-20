const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured" })
  }

  try {
    const groqRes = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    })

    const data = await groqRes.json()
    return res.status(groqRes.status).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
