import { useTranslation } from "react-i18next"
import { useEffect, useRef } from "react"
import "../styles/landing.css"

export default function Landing({ onLogin }) {
  const { i18n } = useTranslation()
  const canvasRef = useRef(null)
  const lang = i18n.language.startsWith("en") ? "en" : i18n.language.startsWith("es") ? "es" : "pt"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener("resize", resize)
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      dx: (Math.random() - 0.5) * 0.25, dy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.35 + 0.05,
      hue: Math.random() > 0.6 ? 260 : Math.random() > 0.5 ? 200 : 160,
    }))
    function draw() {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.dx; p.y += p.dy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},70%,65%,${p.o})`; ctx.fill()
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x, dy = p.y - q.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 130) {
            ctx.beginPath()
            ctx.strokeStyle = `hsla(${p.hue},60%,60%,${0.06 * (1 - d / 130)})`
            ctx.lineWidth = 0.4
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [])

  const texts = {
    pt: {
      badge: "Plataforma de nutrição",
      hero1: "Transforme sua", hero2: "alimentação", hero3: "com dados reais",
      sub: "Registre refeições, acompanhe macros, hidratação e evolua com inteligência — tudo em uma plataforma limpa e rápida.",
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
      sub: "Log meals, track macros, hydration and evolve with intelligence — all in a clean and fast platform.",
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
      sub: "Registra comidas, sigue macros, hidratación y evoluciona con inteligencia — todo en una plataforma limpia y rápida.",
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
    <div className="landing-root">
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />
      <div className="grid-bg" />
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

      <nav className="nav-wrap">
        <div className="nav-inner">
          <div className="nav-logo">
            <div className="nav-dots">
              <div className="nav-dot" style={{ background: "#8b5cf6" }} />
              <div className="nav-dot" style={{ background: "#10b981" }} />
              <div className="nav-dot" style={{ background: "#f43f5e" }} />
            </div>
            <span className="nav-title">Macro Tracker</span>
          </div>
          <div className="nav-right">
            <div style={{ display: "flex", gap: "2px" }}>
              {[{ code: "pt", label: "PT" }, { code: "en", label: "EN" }, { code: "es", label: "ES" }].map((l) => (
                <button key={l.code} className={`lang-btn ${lang === l.code ? "active" : ""}`} onClick={() => i18n.changeLanguage(l.code)}>{l.label}</button>
              ))}
            </div>
            <button className="btn-login" onClick={() => onLogin("login")}>{tx.login}</button>
            <button className="btn-cta" onClick={() => onLogin("cadastro")}>{tx.cta}</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <div className="hero-badge-dot" />
          <span className="hero-badge-text">{tx.badge}</span>
        </div>
        <h1 className="hero-title">
          <span className="hero-title-line1">{tx.hero1}</span>
          <span className="hero-title-line2">{tx.hero2}</span>
          <span className="hero-title-line3">{tx.hero3}</span>
        </h1>
        <p className="hero-sub">{tx.sub}</p>
        <div className="hero-buttons">
          <button className="hero-btn-primary" onClick={() => onLogin("cadastro")}><span>{tx.cta} →</span></button>
          <button className="hero-btn-secondary" onClick={() => onLogin("login")}>{tx.login}</button>
        </div>
        <div className="stats">
          {[
            { val: "148+", label: { pt: "Alimentos locais", en: "Local foods", es: "Alimentos locales" }, color: "#a78bfa" },
            { val: "300k+", label: { pt: "Base USDA", en: "USDA database", es: "Base USDA" }, color: "#34d399" },
            { val: "3", label: { pt: "Idiomas", en: "Languages", es: "Idiomas" }, color: "#60a5fa" },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="stat-label">{s.label[lang]}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="landing-divider" />

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag" style={{ color: "#a78bfa" }}>Features</span>
            <h2 className="section-title">{tx.f_title}</h2>
            <p className="section-sub">{tx.f_sub}</p>
          </div>
          <div className="feature-grid">
            {features.map((f, i) => (
              <div
                className="feature-card" key={i}
                onMouseEnter={e => e.currentTarget.style.background = `rgba(${f.rgb},0.05)`}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
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

      <hr className="landing-divider" />

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag" style={{ color: "#34d399" }}>Process</span>
            <h2 className="section-title">{tx.how_title}</h2>
            <p className="section-sub">{tx.how_sub}</p>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", overflow: "hidden" }}>
            <div className="steps-wrap">
              {tx.steps.map((step, i) => (
                <div className="step" key={i}>
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
        <div className="cta-card">
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

      <hr className="landing-divider" />
      <footer className="footer">
        <div className="footer-inner">
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