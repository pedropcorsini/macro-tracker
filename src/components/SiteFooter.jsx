import { useTranslation } from "react-i18next"

const FOOTER_TEXTS = {
  pt: {
    desc: "Um painel privado para acompanhar alimentação, hidratação, metas e progresso com mais facilidade no dia a dia.",
    footer: "Feito para quem leva saúde a sério.",
    product: "Produto",
    follow: "Siga-me",
    top: "Topo",
    features: "Ecossistema",
    process: "Fluxo",
    start: "Começar",
    disclaimer: "Dados nutricionais são estimativas para acompanhamento pessoal e não substituem orientação profissional.",
  },
  en: {
    desc: "A private control panel to more easily track your diet, hydration, goals, and daily progress.",
    footer: "Built for people who take health seriously.",
    product: "Product",
    follow: "Follow me",
    top: "Top",
    features: "Ecosystem",
    process: "Flow",
    start: "Start",
    disclaimer: "Nutrition data is estimated for personal tracking and does not replace professional guidance.",
  },
  es: {
    desc: "Un panel de control privado para realizar un seguimiento más sencillo de tu dieta, hidratación, objetivos y progreso a diario.",
    footer: "Hecho para quienes se toman la salud en serio.",
    product: "Producto",
    follow: "Sígueme",
    top: "Inicio",
    features: "Ecosistema",
    process: "Flujo",
    start: "Empezar",
    disclaimer: "Los datos nutricionales son estimaciones para seguimiento personal y no sustituyen orientación profesional.",
  },
}

function SocialIcon({ name }) {
  if (name === "github") {
    return (
      <svg className="site-footer-social-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M8 0C3.58 0 0 3.67 0 8.19c0 3.62 2.29 6.69 5.47 7.77.4.08.55-.18.55-.4v-1.42c-2.23.49-2.7-1.1-2.7-1.1-.36-.95-.89-1.2-.89-1.2-.73-.51.05-.5.05-.5.8.06 1.23.85 1.23.85.72 1.26 1.88.9 2.34.69.07-.53.28-.9.51-1.1-1.78-.2-3.64-.91-3.64-4.05 0-.9.31-1.63.82-2.2-.08-.21-.36-1.04.08-2.17 0 0 .68-.22 2.2.84A7.48 7.48 0 0 1 8 3.93c.68 0 1.36.09 2 .27 1.52-1.06 2.2-.84 2.2-.84.44 1.13.16 1.96.08 2.17.51.57.82 1.3.82 2.2 0 3.15-1.87 3.84-3.65 4.05.29.25.55.76.55 1.54v2.24c0 .22.15.48.55.4A8.16 8.16 0 0 0 16 8.19C16 3.67 12.42 0 8 0Z"
        />
      </svg>
    )
  }

  if (name === "instagram") {
    return (
      <svg className="site-footer-social-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <rect x="2.2" y="2.2" width="11.6" height="11.6" rx="3.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="8" r="2.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="11.6" cy="4.5" r="0.8" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg className="site-footer-social-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="3.4" cy="3.4" r="1.4" fill="currentColor" />
      <path fill="currentColor" d="M2.2 6.2h2.4v7.2H2.2V6.2Zm4 0h2.3v1c.34-.55 1.12-1.18 2.35-1.18 2.12 0 3.15 1.36 3.15 3.56v3.82h-2.4V9.84c0-1.05-.37-1.65-1.25-1.65-.82 0-1.27.55-1.48 1.08-.08.2-.1.48-.1.75v3.38H6.2V6.2Z" />
    </svg>
  )
}

export default function SiteFooter({
  brandHref,
  className = "",
  revealStyle,
  showProduct = false,
  showTopLink = false,
}) {
  const { i18n } = useTranslation()
  const lang = i18n.language.startsWith("en") ? "en" : i18n.language.startsWith("es") ? "es" : "pt"
  const tx = FOOTER_TEXTS[lang]
  const LogoTag = brandHref ? "a" : "div"
  const rootClass = [
    "site-footer",
    showProduct ? "site-footer--with-product" : "site-footer--social-only",
    className,
  ].filter(Boolean).join(" ")

  return (
    <footer className={rootClass}>
      <div className="site-footer-inner" data-reveal={revealStyle ? "up" : undefined} style={revealStyle}>
        <div className="site-footer-main">
          <div className="site-footer-brand-block">
            <LogoTag className="site-footer-logo" href={brandHref} aria-label={brandHref ? "Macro Tracker" : undefined}>
              <div className="site-footer-dots">
                <span style={{ background: "#8b5cf6" }} />
                <span style={{ background: "#10b981" }} />
                <span style={{ background: "#f43f5e" }} />
              </div>
              Macro Tracker
            </LogoTag>
            <p className="site-footer-brand-copy">{tx.desc}</p>
          </div>

          <div className="site-footer-nav-grid">
            {showProduct && (
              <div className="site-footer-column">
                <div className="site-footer-column-title">{tx.product}</div>
                <a href="#features">{tx.features}</a>
                <a href="#process">{tx.process}</a>
                <a href="#start">{tx.start}</a>
              </div>
            )}

            <div className="site-footer-column">
              <div className="site-footer-column-title">{tx.follow}</div>
              <a className="site-footer-social-link" href="https://github.com/pedropcorsini" target="_blank" rel="noreferrer">
                <SocialIcon name="github" />
                GitHub
              </a>
              <a className="site-footer-social-link" href="https://www.instagram.com/pedrocrps/" target="_blank" rel="noreferrer">
                <SocialIcon name="instagram" />
                Instagram
              </a>
              <a className="site-footer-social-link" href="https://www.linkedin.com/in/pedropassoscorsini/" target="_blank" rel="noreferrer">
                <SocialIcon name="linkedin" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className={`site-footer-bottom${showTopLink ? "" : " site-footer-bottom--no-top"}`}>
          <span>&copy; {new Date().getFullYear()} Macro Tracker. {tx.footer}</span>
          <span>{tx.disclaimer}</span>
          {showTopLink && <a href="#top">{tx.top}</a>}
        </div>
      </div>
    </footer>
  )
}
