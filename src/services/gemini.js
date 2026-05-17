const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

export async function enviarMensagem(historico, novaMensagem, contextoUsuario) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  const { nome, goals = {} } = contextoUsuario

  const systemPrompt = `Você é um assistente especializado em nutrição e alimentação saudável do app Macro Tracker.
Usuário: ${nome}
Metas diárias: ${goals.cal || 2000} kcal, ${goals.p || 150}g proteína, ${goals.c || 200}g carboidratos, ${goals.f || 65}g gordura, ${goals.water || 2500}ml água.

Você APENAS responde sobre: nutrição, dieta, macronutrientes, alimentação saudável, hidratação, composição corporal, perda e ganho de peso, e dúvidas relacionadas ao app.
Para qualquer outro assunto, recuse educadamente dizendo que só pode ajudar com nutrição e alimentação.
Seja natural e amigável como um amigo que entende de nutrição — não como um robô.
Não mencione as metas do usuário a menos que ele pergunte algo diretamente relacionado (ex: "estou dentro da meta?", "quantas proteínas preciso?"). Use as metas apenas como contexto interno para dar respostas personalizadas quando for relevante.
Se o usuário mandar uma saudação ou mensagem casual, responda de forma leve e natural, sem listar dados nutricionais.
Responda sempre no mesmo idioma que o usuário escrever.
Nunca use formatação markdown (sem asteriscos, sem #, sem **, sem _, sem listas com -). Use apenas texto simples e quebras de linha.`

  const mensagensFormatadas = historico
    .slice(-10)
    .map((m) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.parts[0].text,
    }))

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...mensagensFormatadas,
        { role: "user", content: novaMensagem },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Erro ${response.status}`)
  }

  const data = await response.json()
  const texto = data?.choices?.[0]?.message?.content

  if (!texto) throw new Error("Resposta inválida da API")

  return texto
}
