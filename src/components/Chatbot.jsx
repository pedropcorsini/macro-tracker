import { useState, useRef, useEffect } from "react"
import { enviarMensagem } from "../services/groq"
import { useTema } from "../context/ThemeContext"

function formatHora(date) {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

export default function Chatbot({ usuario, goals }) {
  const { isDark } = useTema()
  const [aberto, setAberto] = useState(false)
  const [mensagens, setMensagens] = useState([])
  const [input, setInput] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [naoLidas, setNaoLidas] = useState(0)
  const [iniciado, setIniciado] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const nomeCompleto = usuario?.user_metadata?.full_name || usuario?.email || "Usuário"
  const primeiroNome = nomeCompleto.includes("@")
    ? nomeCompleto.split("@")[0]
    : nomeCompleto.split(" ")[0]

  const msgBoasVindas = `Olá, ${primeiroNome}! 👋 Tudo bem? Como posso te ajudar hoje?`

  useEffect(() => {
    if (aberto && !iniciado) {
      setIniciado(true)
      setMensagens([
        { id: Date.now(), role: "model", text: msgBoasVindas, hora: formatHora(new Date()), bvs: true },
      ])
    }
    if (aberto) {
      setNaoLidas(0)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [aberto])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens, carregando])

  function resizeTextarea() {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 120) + "px"
  }

  async function enviar() {
    const texto = input.trim()
    if (!texto || carregando) return
    setInput("")
    if (inputRef.current) inputRef.current.style.height = "auto"

    const msgUsuario = { id: Date.now(), role: "user", text: texto, hora: formatHora(new Date()) }
    setMensagens((prev) => [...prev, msgUsuario])
    setCarregando(true)

    try {
      const historico = mensagens
        .filter((m) => !m.bvs)
        .map((m) => ({ role: m.role, parts: [{ text: m.text }] }))
        .slice(-10)

      const resposta = await enviarMensagem(historico, texto, {
        nome: nomeCompleto,
        goals: goals || {},
      })

      const msgBot = { id: Date.now() + 1, role: "model", text: resposta, hora: formatHora(new Date()) }
      setMensagens((prev) => [...prev, msgBot])
      if (!aberto) setNaoLidas((n) => n + 1)
    } catch (err) {
      console.error("[Chatbot] Erro na API Gemini:", err)
      setMensagens((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "model",
          text: "Desculpe, não consegui responder agora. Tente novamente.",
          hora: formatHora(new Date()),
          erro: true,
        },
      ])
    } finally {
      setCarregando(false)
    }
  }

  function limpar() {
    setMensagens([
      { id: Date.now(), role: "model", text: msgBoasVindas, hora: formatHora(new Date()), bvs: true },
    ])
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      enviar()
    }
  }

  const dark = isDark
  const panelBg = dark ? "rgba(10,10,20,0.88)" : "rgba(255,255,255,0.95)"
  const borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const textColor = dark ? "white" : "#111"
  const subtextColor = dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"
  const dividerColor = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"
  const botMsgBg = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
  const inputBg = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"
  const inputBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"

  return (
    <>
      <style>{`
        @keyframes chatbotBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes chatbotPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .chatbot-scroll::-webkit-scrollbar { width: 4px; }
        .chatbot-scroll::-webkit-scrollbar-track { background: transparent; }
        .chatbot-scroll::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 2px; }
        .chatbot-btn:hover { transform: scale(1.06); box-shadow: 0 6px 28px rgba(124,58,237,0.55), 0 2px 8px rgba(0,0,0,0.3) !important; }
        .chatbot-trash:hover { color: rgba(239,68,68,0.8) !important; }
        .chatbot-close:hover { color: rgba(255,255,255,0.8) !important; }
        .chatbot-send:hover:not(:disabled) { filter: brightness(1.15); }
        .chatbot-input::placeholder { color: rgba(128,128,128,0.5); }
      `}</style>

      {/* Botão flutuante */}
      <button
        className="chatbot-btn"
        onClick={() => setAberto((v) => !v)}
        aria-label="Assistente de nutrição"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: aberto ? "22px" : "24px",
          boxShadow: "0 4px 24px rgba(124,58,237,0.4), 0 2px 8px rgba(0,0,0,0.25)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
      >
        {aberto ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : "💬"}

        {!aberto && naoLidas > 0 && (
          <span style={{
            position: "absolute",
            top: "-3px",
            right: "-3px",
            background: "#ef4444",
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            fontSize: "11px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid white",
          }}>
            {naoLidas > 9 ? "9+" : naoLidas}
          </span>
        )}
      </button>

      {/* Painel de chat */}
      <div
        style={{
          position: "fixed",
          bottom: "92px",
          right: "24px",
          width: "360px",
          maxWidth: "calc(100vw - 32px)",
          height: "520px",
          zIndex: 999,
          borderRadius: "20px",
          background: panelBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${borderColor}`,
          boxShadow: dark
            ? "0 8px 40px rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.3)"
            : "0 8px 40px rgba(0,0,0,0.12), 0 2px 12px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transform: aberto ? "translateY(0)" : "translateY(16px)",
          opacity: aberto ? 1 : 0,
          pointerEvents: aberto ? "all" : "none",
          transition: "transform 0.25s ease, opacity 0.25s ease",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "14px 16px",
          borderBottom: `1px solid ${dividerColor}`,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "700",
            fontSize: "18px",
            flexShrink: 0,
          }}>
            🤖
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              color: textColor,
              fontWeight: "600",
              fontSize: "13px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              Macro - AI
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
              <div style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#22c55e",
                animation: "chatbotPulse 2s infinite",
                flexShrink: 0,
              }} />
              <span style={{ color: subtextColor, fontSize: "11px" }}>Assistente de Nutrição</span>
            </div>
          </div>

          <button
            className="chatbot-trash"
            onClick={limpar}
            title="Limpar histórico"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: subtextColor,
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              transition: "color 0.15s",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>

          <button
            className="chatbot-close"
            onClick={() => setAberto(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: subtextColor,
              padding: "6px",
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
              transition: "color 0.15s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Área de mensagens */}
        <div
          className="chatbot-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {mensagens.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: "7px",
              }}
            >
              {msg.role === "model" && (
                <span style={{ fontSize: "18px", flexShrink: 0, marginBottom: "18px" }}>🥗</span>
              )}
              <div style={{ maxWidth: "82%" }}>
                <div style={{
                  padding: "9px 13px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                    : msg.erro ? "rgba(239,68,68,0.12)" : botMsgBg,
                  color: msg.role === "user" ? "white" : textColor,
                  fontSize: "13px",
                  lineHeight: "1.55",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  border: msg.erro ? "1px solid rgba(239,68,68,0.25)" : "none",
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: "10px",
                  color: subtextColor,
                  marginTop: "3px",
                  textAlign: msg.role === "user" ? "right" : "left",
                }}>
                  {msg.hora}
                </div>
              </div>
            </div>
          ))}

          {/* Digitando */}
          {carregando && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "7px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>🥗</span>
              <div style={{
                padding: "12px 16px",
                borderRadius: "16px 16px 16px 4px",
                background: botMsgBg,
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#7c3aed",
                      animation: `chatbotBounce 1.2s infinite ${i * 0.18}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "10px 14px 14px",
          borderTop: `1px solid ${dividerColor}`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <textarea
                ref={inputRef}
                className="chatbot-input"
                value={input}
                onChange={(e) => { setInput(e.target.value.slice(0, 500)); resizeTextarea() }}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte sobre nutrição..."
                disabled={carregando}
                rows={1}
                style={{
                  width: "100%",
                  background: inputBg,
                  border: `1px solid ${inputBorder}`,
                  borderRadius: "12px",
                  padding: "9px 12px",
                  paddingRight: input.length > 400 ? "44px" : "12px",
                  color: textColor,
                  fontSize: "13px",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  lineHeight: "1.4",
                  maxHeight: "120px",
                  overflowY: "hidden",
                  boxSizing: "border-box",
                  display: "block",
                }}
              />
              {input.length > 400 && (
                <span style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "10px",
                  fontSize: "10px",
                  color: input.length >= 500 ? "#ef4444" : subtextColor,
                  pointerEvents: "none",
                }}>
                  {input.length}/500
                </span>
              )}
            </div>
            <button
              className="chatbot-send"
              onClick={enviar}
              disabled={!input.trim() || carregando}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                background: input.trim() && !carregando
                  ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                  : dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
                border: "none",
                cursor: input.trim() && !carregando ? "pointer" : "default",
                color: input.trim() && !carregando ? "white" : subtextColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s, color 0.2s",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
