import { useTranslation } from "react-i18next"
import { useEffect, useRef, useState } from "react"
import LanguageSelect from "../components/LanguageSelect"
import "../styles/landing.css"

export default function Landing({ onLogin }) {
  const { i18n } = useTranslation()
  const rootRef = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const lang = i18n.language.startsWith("en") ? "en" : i18n.language.startsWith("es") ? "es" : "pt"
  const revealStyle = (delay = 0) => ({ "--reveal-delay": `${delay}ms` })

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18)

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const elements = Array.from(root.querySelectorAll("[data-reveal]"))
    if (!elements.length) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduceMotion.matches) {
      elements.forEach((element) => element.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -12% 0px",
      }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const texts = {
    pt: {
      badge: "Plataforma de nutrição",
      hero1: "Transforme sua", hero2: "alimentação", hero3: "com dados reais",
      sub: "Registre refeições, acompanhe macros, hidratação e evolua com inteligência, tudo em uma plataforma limpa e rápida.",
      cta: "Começar gratuitamente", login: "Entrar na conta",
      f_title: "Funcionalidades", f_sub: "Tudo que você precisa para uma nutrição precisa.",
      how_title: "Como funciona", how_sub: "Simples, rápido e eficiente.",
      cta2: "Pronto para começar?", cta2_sub: "Crie sua conta em segundos. Sem cartão de crédito.",
      footer: "Feito para quem leva saúde a sério.",
      steps: [
        { n: "01", t: "Crie sua conta", d: "Cadastro rápido com email, Google ou GitHub." },
        { n: "02", t: "Configure suas metas", d: "Defina calorias, proteínas, carboidratos, gordura e água." },
        { n: "03", t: "Registre suas refeições", d: "Busque em 300k+ alimentos e adicione ao seu dia." },
        { n: "04", t: "Acompanhe a evolução", d: "Gráficos semanais e calendário visual de histórico." },
      ],
    },
    en: {
      badge: "Nutrition platform",
      hero1: "Transform your", hero2: "eating habits", hero3: "with real data",
      sub: "Log meals, track macros, hydration and evolve with intelligence, all in a clean and fast platform.",
      cta: "Start for free", login: "Sign in",
      f_title: "Features", f_sub: "Everything you need for precise nutrition.",
      how_title: "How it works", how_sub: "Simple, fast and efficient.",
      cta2: "Ready to start?", cta2_sub: "Create your account in seconds. No credit card required.",
      footer: "Built for people who take health seriously.",
      steps: [
        { n: "01", t: "Create your account", d: "Quick signup with email, Google or GitHub." },
        { n: "02", t: "Set your goals", d: "Define calories, protein, carbs, fat and water." },
        { n: "03", t: "Log your meals", d: "Search 300k+ foods and add them to your day." },
        { n: "04", t: "Track your progress", d: "Weekly charts and visual history calendar." },
      ],
    },
    es: {
      badge: "Plataforma de nutrición",
      hero1: "Transforma tu", hero2: "alimentación", hero3: "con datos reales",
      sub: "Registra comidas, sigue macros, hidratación y evoluciona con inteligencia, todo en una plataforma limpia y rápida.",
      cta: "Empezar gratis", login: "Iniciar sesión",
      f_title: "Funcionalidades", f_sub: "Todo lo que necesitas para una nutrición precisa.",
      how_title: "Cómo funciona", how_sub: "Simple, rápido y eficiente.",
      cta2: "¿Listo para empezar?", cta2_sub: "Crea tu cuenta en segundos. Sin tarjeta de crédito.",
      footer: "Hecho para quienes se toman la salud en serio.",
      steps: [
        { n: "01", t: "Crea tu cuenta", d: "Registro rápido con email, Google o GitHub." },
        { n: "02", t: "Configura tus metas", d: "Define calorías, proteínas, carbos, grasa y agua." },
        { n: "03", t: "Registra tus comidas", d: "Busca en 300k+ alimentos y agrégalos a tu día." },
        { n: "04", t: "Sigue tu evolución", d: "Gráficos semanales y calendario visual de historial." },
      ],
    },
  }

  const features = [
    { emoji: "🍽️", color: "#8b5cf6", rgb: "139,92,246", title: { pt: "Registro de refeições", en: "Meal logging", es: "Registro de comidas" }, desc: { pt: "Café da manhã, almoço, lanche e jantar.", en: "Breakfast, lunch, snack and dinner.", es: "Desayuno, almuerzo, merienda y cena." } },
    { emoji: "⚡", color: "#10b981", rgb: "16,185,129", title: { pt: "Macros em tempo real", en: "Real-time macros", es: "Macros en tiempo real" }, desc: { pt: "Calorias, proteína, carbs e gordura ao vivo.", en: "Calories, protein, carbs and fat live.", es: "Calorías, proteína, carbos y grasa en vivo." } },
    { emoji: "💧", color: "#3b82f6", rgb: "59,130,246", title: { pt: "Controle de hidratação", en: "Hydration tracking", es: "Control de hidratación" }, desc: { pt: "Copos visuais com metas personalizadas.", en: "Visual cups with custom goals.", es: "Vasos visuales con metas personalizadas." } },
    { emoji: "📈", color: "#f59e0b", rgb: "245,158,11", title: { pt: "Gráficos de evolução", en: "Progress charts", es: "Gráficos de evolución" }, desc: { pt: "Barras semanais e mensais com metas.", en: "Weekly and monthly bars with goals.", es: "Barras semanales y mensuales con metas." } },
    { emoji: "📅", color: "#ef4444", rgb: "239,68,68", title: { pt: "Calendário de histórico", en: "History calendar", es: "Calendario de historial" }, desc: { pt: "Indicadores visuais de cumprimento diário.", en: "Visual daily goal completion indicators.", es: "Indicadores visuales de cumplimiento diario." } },
    { emoji: "☁️", color: "#06b6d4", rgb: "6,182,212", title: { pt: "Nuvem e multi-idiomas", en: "Cloud & multi-language", es: "Nube y multi-idioma" }, desc: { pt: "Dados seguros em PT, EN e ES.", en: "Secure data in PT, EN and ES.", es: "Datos seguros en PT, EN y ES." } },
  ]

  const tx = texts[lang]

  return (
    <div ref={rootRef} className="landing-root">
      <div className="grid-bg" />
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

      <nav className={`nav-wrap ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="nav-logo">
              <div className="nav-dots">
                <div className="nav-dot" style={{ background: "#8b5cf6" }} />
                <div className="nav-dot" style={{ background: "#10b981" }} />
                <div className="nav-dot" style={{ background: "#f43f5e" }} />
              </div>
              <span className="nav-title">Macro Tracker</span>
            </div>
            <LanguageSelect variant="landing" />
          </div>
          <div className="nav-actions">
            <button className="btn-login" onClick={() => onLogin("login")}>{tx.login}</button>
            <button className="btn-cta" onClick={() => onLogin("cadastro")}>{tx.cta}</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge" data-reveal="up" style={revealStyle(40)}>
          <div className="hero-badge-dot" />
          <span className="hero-badge-text">{tx.badge}</span>
        </div>
        <h1 className="hero-title" data-reveal="up" style={revealStyle(120)}>
          <span className="hero-title-line1">{tx.hero1}</span>
          <span className="hero-title-line2">{tx.hero2}</span>
          <span className="hero-title-line3">{tx.hero3}</span>
        </h1>
        <p className="hero-sub" data-reveal="up" style={revealStyle(200)}>{tx.sub}</p>
        <div className="hero-buttons" data-reveal="up" style={revealStyle(280)}>
          <button className="hero-btn-primary" onClick={() => onLogin("cadastro")}><span>{tx.cta} →</span></button>
          <button className="hero-btn-secondary" onClick={() => onLogin("login")}>{tx.login}</button>
        </div>
        <div className="stats">
          {[
            { val: "148+", label: { pt: "Alimentos locais", en: "Local foods", es: "Alimentos locales" }, color: "#a78bfa" },
            { val: "300k+", label: { pt: "Base USDA", en: "USDA database", es: "Base USDA" }, color: "#34d399" },
            { val: "3", label: { pt: "Idiomas", en: "Languages", es: "Idiomas" }, color: "#60a5fa" },
          ].map((s, i) => (
            <div className="stat-card" data-reveal="scale" style={revealStyle(360 + i * 80)} key={i}>
              <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="stat-label">{s.label[lang]}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="landing-divider" data-reveal="line" style={revealStyle(40)} />

      <section className="section">
        <div className="section-inner">
          <div className="section-header" data-reveal="up" style={revealStyle(60)}>
            <span className="section-tag" style={{ color: "#a78bfa" }}>Features</span>
            <h2 className="section-title">{tx.f_title}</h2>
            <p className="section-sub">{tx.f_sub}</p>
          </div>
          <div className="feature-grid">
            {features.map((f, i) => (
              <div
                className="feature-card" data-reveal="scale" style={revealStyle(120 + i * 70)} key={i}
              >
                <div className="feature-icon-wrap" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>{f.emoji}</div>
                <div className="feature-title">{f.title[lang]}</div>
                <div className="feature-desc">{f.desc[lang]}</div>
                <div className="feature-line" style={{ background: `linear-gradient(90deg, ${f.color}60, transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="landing-divider" data-reveal="line" style={revealStyle(40)} />

      <section className="section">
        <div className="section-inner">
          <div className="section-header" data-reveal="up" style={revealStyle(60)}>
            <span className="section-tag" style={{ color: "#34d399" }}>Process</span>
            <h2 className="section-title">{tx.how_title}</h2>
            <p className="section-sub">{tx.how_sub}</p>
          </div>
          <div data-reveal="up" style={{ ...revealStyle(120), border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", overflow: "hidden" }}>
            <div className="steps-wrap">
              {tx.steps.map((step, i) => (
                <div className="step" data-reveal="up" style={revealStyle(180 + i * 80)} key={i}>
                  <div className="step-indicator" />
                  <div className="step-num">{step.n}</div>
                  <div className="step-title">{step.t}</div>
                  <div className="step-desc">{step.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="cta-section">
        <div className="cta-card" data-reveal="scale" style={revealStyle(80)}>
          <div className="cta-card-bg" />
          <div className="cta-card-content">
            <span className="section-tag" style={{ color: "#a78bfa", display: "block", marginBottom: "16px" }}>Get started</span>
            <h2 className="cta-title">{tx.cta2}</h2>
            <p className="cta-sub">{tx.cta2_sub}</p>
            <div className="cta-buttons">
              <button className="hero-btn-primary" onClick={() => onLogin("cadastro")}><span>{tx.cta} →</span></button>
              <button className="hero-btn-secondary" onClick={() => onLogin("login")}>{tx.login}</button>
            </div>
          </div>
        </div>
      </div>

      <hr className="landing-divider" data-reveal="line" style={revealStyle(40)} />
      <footer className="footer">
        <div className="footer-inner" data-reveal="up" style={revealStyle(60)}>
          <div className="footer-logo">
            <div className="nav-dots">
              <div className="nav-dot" style={{ background: "#8b5cf6", width: "5px", height: "5px" }} />
              <div className="nav-dot" style={{ background: "#10b981", width: "5px", height: "5px" }} />
              <div className="nav-dot" style={{ background: "#f43f5e", width: "5px", height: "5px" }} />
            </div>
            Macro Tracker
          </div>
          <span className="footer-text">{tx.footer}</span>
          <span className="footer-text">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
