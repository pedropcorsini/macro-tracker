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
      badge: "Precision Nutrition Infrastructure",
      hero1: "Orquestre sua", hero2: "nutrição diária", hero3: "com precisão visual",
      sub: "Um ambiente moderno para registrar refeições, controlar hidratação, acompanhar macros e transformar consistência em clareza operacional.",
      cta: "Começar gratuitamente", login: "Entrar na conta",
      nav_features: "Ecossistema", nav_process: "Fluxo", nav_start: "Acesso",
      feature_tag: "Nutrition OS",
      process_tag: "Operating Flow",
      start_tag: "Get started",
      f_title: "Um ecossistema completo para decisões melhores.",
      f_sub: "Registro, metas, favoritos, calendário e gráficos trabalhando como uma camada única de inteligência nutricional.",
      how_title: "Do registro ao insight, sem atrito.",
      how_sub: "A navegação foi pensada para reduzir esforço e manter o foco no próximo passo.",
      cta2: "Pronto para operar sua rotina com mais clareza?",
      cta2_sub: "Crie sua conta em segundos e entre em um painel limpo, rápido e preparado para uso diário.",
      footer: "Feito para quem leva saúde a sério.",
      steps: [
        { n: "01", t: "Configure a base", d: "Defina metas de calorias, macros, água e tamanho do copo." },
        { n: "02", t: "Registre com fluidez", d: "Busque alimentos, use favoritos e registre cada refeição sem sair do fluxo." },
        { n: "03", t: "Monitore sinais", d: "Veja progresso diário, hidratação e aderência com leitura rápida." },
        { n: "04", t: "Aja com contexto", d: "Use gráficos e calendário para entender padrões semanais e mensais." },
      ],
    },
    en: {
      badge: "Precision Nutrition Infrastructure",
      hero1: "Orchestrate your", hero2: "daily nutrition", hero3: "with visual precision",
      sub: "A modern workspace to log meals, manage hydration, track macros and turn consistency into operational clarity.",
      cta: "Start for free", login: "Sign in",
      nav_features: "Ecosystem", nav_process: "Flow", nav_start: "Access",
      feature_tag: "Nutrition OS",
      process_tag: "Operating Flow",
      start_tag: "Get started",
      f_title: "A complete ecosystem for better decisions.",
      f_sub: "Logging, goals, favorites, calendar and charts working as one nutrition intelligence layer.",
      how_title: "From log to insight, without friction.",
      how_sub: "Navigation is designed to reduce effort and keep the next step obvious.",
      cta2: "Ready to operate your routine with more clarity?",
      cta2_sub: "Create your account in seconds and enter a clean, fast panel built for daily use.",
      footer: "Built for people who take health seriously.",
      steps: [
        { n: "01", t: "Set the baseline", d: "Define calories, macros, water and cup size goals." },
        { n: "02", t: "Log with flow", d: "Search foods, use favorites and record each meal without breaking context." },
        { n: "03", t: "Monitor signals", d: "Read daily progress, hydration and adherence at a glance." },
        { n: "04", t: "Act with context", d: "Use charts and calendar views to understand weekly and monthly patterns." },
      ],
    },
    es: {
      badge: "Precision Nutrition Infrastructure",
      hero1: "Orquesta tu", hero2: "nutrición diaria", hero3: "con precisión visual",
      sub: "Un entorno moderno para registrar comidas, controlar hidratación, seguir macros y convertir consistencia en claridad operacional.",
      cta: "Empezar gratis", login: "Iniciar sesión",
      nav_features: "Ecosistema", nav_process: "Flujo", nav_start: "Acceso",
      feature_tag: "Nutrition OS",
      process_tag: "Operating Flow",
      start_tag: "Get started",
      f_title: "Un ecosistema completo para mejores decisiones.",
      f_sub: "Registro, metas, favoritos, calendario y gráficos trabajando como una capa única de inteligencia nutricional.",
      how_title: "Del registro al insight, sin fricción.",
      how_sub: "La navegación fue pensada para reducir esfuerzo y mantener claro el próximo paso.",
      cta2: "¿Listo para operar tu rutina con más claridad?",
      cta2_sub: "Crea tu cuenta en segundos y entra en un panel limpio, rápido y preparado para uso diario.",
      footer: "Hecho para quienes se toman la salud en serio.",
      steps: [
        { n: "01", t: "Configura la base", d: "Define calorías, macros, agua y tamaño del vaso." },
        { n: "02", t: "Registra con fluidez", d: "Busca alimentos, usa favoritos y registra cada comida sin salir del flujo." },
        { n: "03", t: "Monitorea señales", d: "Lee progreso diario, hidratación y adherencia de un vistazo." },
        { n: "04", t: "Actúa con contexto", d: "Usa gráficos y calendario para entender patrones semanales y mensuales." },
      ],
    },
  }

  const features = [
    { emoji: "LOG", color: "#8b5cf6", rgb: "139,92,246", title: { pt: "Registro de refeições", en: "Meal logging", es: "Registro de comidas" }, desc: { pt: "Café da manhã, almoço, lanche e jantar em um fluxo único.", en: "Breakfast, lunch, snack and dinner in one flow.", es: "Desayuno, almuerzo, merienda y cena en un solo flujo." } },
    { emoji: "LIVE", color: "#10b981", rgb: "16,185,129", title: { pt: "Macros em tempo real", en: "Real-time macros", es: "Macros en tiempo real" }, desc: { pt: "Calorias, proteína, carbs e gordura atualizados a cada registro.", en: "Calories, protein, carbs and fat updated with each log.", es: "Calorías, proteína, carbos y grasa actualizados en cada registro." } },
    { emoji: "H2O", color: "#3b82f6", rgb: "59,130,246", title: { pt: "Controle de hidratação", en: "Hydration tracking", es: "Control de hidratación" }, desc: { pt: "Copos visuais, entrada manual e metas personalizadas.", en: "Visual cups, manual input and custom goals.", es: "Vasos visuales, entrada manual y metas personalizadas." } },
    { emoji: "KPI", color: "#f59e0b", rgb: "245,158,11", title: { pt: "Gráficos de evolução", en: "Progress charts", es: "Gráficos de evolución" }, desc: { pt: "Barras semanais e mensais com linhas de referência.", en: "Weekly and monthly bars with reference lines.", es: "Barras semanales y mensuales con líneas de referencia." } },
    { emoji: "CAL", color: "#ef4444", rgb: "239,68,68", title: { pt: "Calendário de histórico", en: "History calendar", es: "Calendario de historial" }, desc: { pt: "Indicadores visuais de aderência diária e hidratação.", en: "Visual indicators for daily adherence and hydration.", es: "Indicadores visuales de adherencia diaria e hidratación." } },
    { emoji: "SYNC", color: "#06b6d4", rgb: "6,182,212", title: { pt: "Nuvem e multi-idiomas", en: "Cloud & multi-language", es: "Nube y multi-idioma" }, desc: { pt: "Dados seguros com suporte em PT, EN e ES.", en: "Secure data with PT, EN and ES support.", es: "Datos seguros con soporte en PT, EN y ES." } },
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
          <div className="nav-menu" aria-label="Navegação da página">
            <a href="#features">{tx.nav_features}</a>
            <span>/</span>
            <a href="#process">{tx.nav_process}</a>
            <span>/</span>
            <a href="#start">{tx.nav_start}</a>
          </div>
          <div className="nav-actions">
            <button className="btn-login" onClick={() => onLogin("login")}>{tx.login}</button>
            <button className="btn-cta" onClick={() => onLogin("cadastro")}>{tx.cta}</button>
          </div>
        </div>
      </nav>

      <section className="hero" id="top">
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

      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-header" data-reveal="up" style={revealStyle(60)}>
            <span className="section-tag" style={{ color: "#a78bfa" }}>{tx.feature_tag}</span>
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

      <section className="section" id="process">
        <div className="section-inner">
          <div className="section-header" data-reveal="up" style={revealStyle(60)}>
            <span className="section-tag" style={{ color: "#34d399" }}>{tx.process_tag}</span>
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

      <div className="cta-section" id="start">
        <div className="cta-card" data-reveal="scale" style={revealStyle(80)}>
          <div className="cta-card-bg" />
          <div className="cta-card-content">
            <span className="section-tag" style={{ color: "#a78bfa", display: "block", marginBottom: "16px" }}>{tx.start_tag}</span>
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
