import { useEffect, useRef, useState } from "react"
import { useTema } from "../context/ThemeContext"
import { useTranslation } from "react-i18next"
import { supabase } from "../services/supabase"
import "../styles/app.css"

const PROVIDER_LABELS = {
  email: "Email",
  github: "GitHub",
  google: "Google",
}

const BR_PHONE_RE = /^(\+55\s*)?\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}$/
const US_PHONE_RE = /^(\+1\s*)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/

function getMetadata(usuario) {
  return usuario?.user_metadata || {}
}

function getProfileName(usuario) {
  const metadata = getMetadata(usuario)
  return (
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    metadata.preferred_username ||
    ""
  )
}

function getDisplayName(usuario) {
  return getProfileName(usuario) || usuario?.email?.split("@")[0] || ""
}

function getAvatarUrl(usuario) {
  const metadata = getMetadata(usuario)
  return metadata.avatar_url || metadata.picture || metadata.photo_url || ""
}

function getPhone(usuario) {
  const metadata = getMetadata(usuario)
  return metadata.phone || metadata.phone_number || usuario?.phone || ""
}

function getProviders(usuario) {
  const providers = Array.isArray(usuario?.app_metadata?.providers)
    ? usuario.app_metadata.providers
    : []
  const provider = usuario?.app_metadata?.provider

  return [...new Set([...providers, provider].filter(Boolean))]
}

function getLocale(language = "") {
  if (language.startsWith("en")) return "en-US"
  if (language.startsWith("es")) return "es-ES"
  return "pt-BR"
}

function formatDate(value, language) {
  if (!value) return ""

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""

  return new Intl.DateTimeFormat(getLocale(language), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function getInitials(name, email) {
  const base = name || email || "U"
  const words = base
    .replace(/@.*/, "")
    .split(/[.\s_-]+/)
    .filter(Boolean)

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

function providerLabel(provider) {
  return PROVIDER_LABELS[provider] || provider
}

function ProviderIcon({ provider }) {
  if (provider === "google") {
    return (
      <svg className="account-provider-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    )
  }

  if (provider === "github") {
    return (
      <svg className="account-provider-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    )
  }

  return null
}

function ProviderDisplay({ provider, compact = false }) {
  const hasIcon = provider === "google" || provider === "github"
  const label = providerLabel(provider)

  if (hasIcon) {
    return (
      <span className={compact ? "account-provider-symbol compact" : "account-provider-symbol"} aria-label={label} title={label}>
        <ProviderIcon provider={provider} />
      </span>
    )
  }

  return <span>{label}</span>
}

function onlyDigits(value) {
  return value.replace(/\D/g, "")
}

function formatBrPhone(digits, withCountry = false) {
  const area = digits.slice(0, 2)
  const local = digits.slice(2)
  const prefix = withCountry ? "+55 " : ""

  if (local.length === 9) {
    return `${prefix}(${area}) ${local.slice(0, 5)}-${local.slice(5)}`
  }

  return `${prefix}(${area}) ${local.slice(0, 4)}-${local.slice(4)}`
}

function formatUsPhone(digits, withCountry = false) {
  const local = digits.slice(0, 10)
  const prefix = withCountry ? "+1 " : ""
  return `${prefix}(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`
}

function formatPhone(value) {
  const text = value.trim()
  const digits = onlyDigits(value)

  if (!digits) return ""
  if (BR_PHONE_RE.test(text)) {
    const brDigits = digits.startsWith("55") ? digits.slice(2) : digits
    return formatBrPhone(brDigits, digits.startsWith("55"))
  }
  if (US_PHONE_RE.test(text)) {
    const usDigits = digits.startsWith("1") && digits.length === 11 ? digits.slice(1) : digits
    return formatUsPhone(usDigits, digits.startsWith("1") && digits.length === 11)
  }
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return formatBrPhone(digits.slice(2), true)
  }
  if (digits.startsWith("1") && digits.length === 11) {
    return formatUsPhone(digits.slice(1), true)
  }
  if (digits.length === 11) return formatBrPhone(digits)
  if (digits.length === 10) return formatUsPhone(digits)

  return value.trim()
}

function isValidPhone(value) {
  const text = value.trim()
  const digits = onlyDigits(value)

  if (!digits) return true
  if (BR_PHONE_RE.test(text) || US_PHONE_RE.test(text)) return true
  if (digits.startsWith("55")) return digits.length === 12 || digits.length === 13
  if (digits.startsWith("1")) return digits.length === 11
  return digits.length === 10 || digits.length === 11
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="account-detail-item">
      <span className="account-detail-label">{label}</span>
      <strong className="account-detail-value">{value}</strong>
    </div>
  )
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function imageFileToAvatarUrl(file) {
  const dataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(dataUrl)
  const size = 320
  const scale = Math.max(size / image.width, size / image.height)
  const width = image.width * scale
  const height = image.height * scale
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  canvas.width = size
  canvas.height = size
  context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height)

  return canvas.toDataURL("image/jpeg", 0.82)
}

export default function Conta({ usuario }) {
  const { isDark } = useTema()
  const { t, i18n } = useTranslation()
  const d = isDark
  const metadata = getMetadata(usuario)
  const providers = getProviders(usuario)
  const email = usuario?.email || metadata.email || t("account_not_available")
  const fallback = t("account_not_available")
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [editando, setEditando] = useState("")
  const [rascunho, setRascunho] = useState("")
  const [salvandoCampo, setSalvandoCampo] = useState("")
  const [salvandoFoto, setSalvandoFoto] = useState(false)
  const [fotoPerfil, setFotoPerfil] = useState("")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const fotoInputRef = useRef(null)

  const displayName = nome.trim() || getDisplayName(usuario)
  const avatarUrl = fotoPerfil || getAvatarUrl(usuario)

  useEffect(() => {
    setNome(getProfileName(usuario))
    setTelefone(getPhone(usuario))
    setFotoPerfil(getAvatarUrl(usuario))
    setEditando("")
    setRascunho("")
    setErro("")
    setSucesso("")
  }, [usuario])

  async function alterarFoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErro(t("account_photo_format_error"))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErro(t("account_photo_size_error"))
      return
    }

    setErro("")
    setSucesso("")
    setSalvandoFoto(true)

    try {
      const nextAvatarUrl = await imageFileToAvatarUrl(file)

      if (nextAvatarUrl.length > 350000) {
        throw new Error(t("account_photo_size_error"))
      }

      const nextMetadata = {
        ...metadata,
        full_name: nome.trim(),
        name: nome.trim(),
        phone: telefone,
        avatar_url: nextAvatarUrl,
        picture: nextAvatarUrl,
        photo_url: nextAvatarUrl,
      }

      const { error } = await supabase.auth.updateUser({ data: nextMetadata })
      if (error) throw error

      setFotoPerfil(nextAvatarUrl)
      setSucesso(t("account_photo_saved"))
    } catch (error) {
      setErro(error.message || t("account_save_error"))
    } finally {
      setSalvandoFoto(false)
    }
  }

  function iniciarEdicao(campo) {
    setErro("")
    setSucesso("")
    setEditando(campo)
    setRascunho(campo === "nome" ? nome : telefone)
  }

  function cancelarEdicao() {
    setEditando("")
    setRascunho("")
    setErro("")
  }

  async function salvarCampo(campo) {
    const valorAtual = campo === "nome" ? nome : telefone
    const valorLimpo = campo === "telefone" ? formatPhone(rascunho) : rascunho.trim()

    if (campo === "telefone" && !isValidPhone(rascunho)) {
      setErro(t("account_phone_format_error"))
      return
    }

    if (valorLimpo === valorAtual) {
      cancelarEdicao()
      return
    }

    setErro("")
    setSucesso("")
    setSalvandoCampo(campo)

    try {
      const nextMetadata = {
        ...metadata,
        full_name: campo === "nome" ? valorLimpo : nome.trim(),
        name: campo === "nome" ? valorLimpo : nome.trim(),
        phone: campo === "telefone" ? valorLimpo : telefone,
        ...(avatarUrl ? { avatar_url: avatarUrl, picture: avatarUrl, photo_url: avatarUrl } : {}),
      }

      const { error } = await supabase.auth.updateUser({ data: nextMetadata })
      if (error) throw error

      if (campo === "nome") setNome(valorLimpo)
      if (campo === "telefone") setTelefone(valorLimpo)

      setEditando("")
      setRascunho("")
      setSucesso(t("account_inline_saved"))
    } catch (error) {
      setErro(error.message || t("account_save_error"))
    } finally {
      setSalvandoCampo("")
    }
  }

  function handleInputKeyDown(event, campo) {
    if (event.key === "Enter") {
      event.preventDefault()
      salvarCampo(campo)
    }

    if (event.key === "Escape") {
      cancelarEdicao()
    }
  }

  function editableRow({ campo, label, value, emptyText, inputType = "text", placeholder }) {
    const isEditing = editando === campo
    const isSaving = salvandoCampo === campo

    return (
      <div className="account-detail-item account-detail-item--editable">
        <span className="account-detail-label">{label}</span>
        <div className="account-editable-control">
          {isEditing ? (
            <input
              autoFocus
              type={inputType}
              value={rascunho}
              onChange={(event) => setRascunho(event.target.value)}
              onBlur={() => salvarCampo(campo)}
              onKeyDown={(event) => handleInputKeyDown(event, campo)}
              placeholder={placeholder}
              className={d ? "account-inline-input" : "account-inline-input light"}
            />
          ) : (
            <strong className={`account-detail-value account-editable-value${value ? "" : " is-empty"}`}>
              {value || emptyText}
            </strong>
          )}

          <button
            type="button"
            className="account-edit-button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => (isEditing ? salvarCampo(campo) : iniciarEdicao(campo))}
            aria-label={t(campo === "nome" ? "account_edit_name" : "account_edit_phone")}
            disabled={isSaving}
          >
            <PencilIcon />
          </button>
        </div>
      </div>
    )
  }

  const details = [
    { label: t("account_email"), value: email },
    {
      label: t("account_provider"),
      value: providers.length ? (
        <span className="account-provider-icons">
          {providers.map((provider) => (
            <ProviderDisplay key={provider} provider={provider} compact />
          ))}
        </span>
      ) : t("account_provider_unknown"),
    },
    { label: t("account_created"), value: formatDate(usuario?.created_at, i18n.language) || fallback },
    { label: t("account_last_sign_in"), value: formatDate(usuario?.last_sign_in_at, i18n.language) || fallback },
    { label: t("account_user_id"), value: usuario?.id || fallback },
  ]

  return (
    <div className="page-shell account-page">
      <div className="page-header">
        <div className="page-tag">{t("account_tag")}</div>
        <h1 className={d ? "page-title" : "page-title light"}>{t("account_title")}</h1>
        <p className="page-sub">{t("account_subtitle")}</p>
      </div>

      <section className={d ? "app-card account-profile-card" : "app-card light account-profile-card"}>
        <div className="account-hero">
          <div className="account-avatar-wrap" aria-label={avatarUrl ? t("account_avatar_alt") : t("account_no_photo")}>
            {avatarUrl ? (
              <img
                className="account-avatar"
                src={avatarUrl}
                alt={t("account_avatar_alt")}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="account-avatar-fallback">
                {getInitials(displayName, email)}
              </div>
            )}

            <button
              type="button"
              className="account-avatar-edit"
              onClick={() => fotoInputRef.current?.click()}
              aria-label={t("account_change_photo")}
              disabled={salvandoFoto}
            >
              {salvandoFoto ? <span className="account-avatar-spinner" /> : <CameraIcon />}
            </button>

            <input
              ref={fotoInputRef}
              type="file"
              accept="image/*"
              className="account-avatar-input"
              onChange={alterarFoto}
            />
          </div>

          <div className="account-identity">
            <span className="app-card-label">{t("account_logged_as")}</span>
            <h2 className={d ? "account-name" : "account-name light"}>{displayName || t("account_no_name")}</h2>
            <p className="account-email">{email}</p>
          </div>
        </div>
      </section>

      <section className={d ? "app-card" : "app-card light"}>
        <div className="app-card-label">{t("account_details")}</div>
        <div className="account-detail-grid">
          {editableRow({
            campo: "nome",
            label: t("account_name"),
            value: nome.trim(),
            emptyText: t("account_no_name"),
            placeholder: t("account_name_placeholder"),
          })}

          {editableRow({
            campo: "telefone",
            label: t("account_phone"),
            value: telefone,
            emptyText: t("account_phone_empty"),
            inputType: "tel",
            placeholder: t("account_phone_placeholder"),
          })}

          {details.map((item) => (
            <DetailItem key={item.label} label={item.label} value={item.value} />
          ))}
        </div>

        {erro && <div className="account-alert error">{erro}</div>}
        {sucesso && <div className="account-alert success">{sucesso}</div>}
      </section>
    </div>
  )
}
