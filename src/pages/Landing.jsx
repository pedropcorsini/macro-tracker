import { useTranslation } from "react-i18next"
import { useEffect, useRef } from "react"

export default function Landing({ onLogin }) {
  const { i18n } = useTranslation()
  const canvasRef = useRef(null)

  // Partículas animadas no fundo
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1,
    }))

    function draw() {
      ctx.clearRect(0, 0, W, H)
      particles.forEach((p) => {
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139,92,246,${p.o})`
        ctx.fill()
      })
      // linhas entre partículas próximas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  const lang = i18n.language.startsWith("en") ? "en" : i18n.language.startsWith("es") ? "es" : "pt"

  const texts = {
    pt: {
      badge: "Nutrição inteligente",
      hero1: "Controle total da",
      hero2: "sua nutrição",
      heroSub: "Registre refeições, acompanhe macros, hidratação e evolua com dados reais — tudo em um só lugar.",
      cta: "Começar gratuitamente",
      login: "Entrar",
      featuresTitle: "Uma plataforma completa",
      featuresSub: "Tudo que você precisa para transformar sua alimentação.",
      howTitle: "Simples de usar",
      howSub: "Do cadastro ao resultado em poucos passos.",
      ctaFinal: "Pronto para começar?",
      ctaFinalSub: "Crie sua conta gratuitamente e comece a monitorar sua nutrição hoje.",
      footer: "Feito para quem leva saúde a sério.",
      steps: [
        { n: "01", t: "Crie sua conta", d: "Cadastro em segundos com email ou Google." },
        { n: "02", t: "Configure suas metas", d: "Defina calorias, macros e hidratação personalizados." },
        { n: "03", t: "Registre refeições", d: "Busque em 300k+ alimentos e adicione ao seu dia." },
        { n: "04", t: "Acompanhe a evolução", d: "Gráficos e calendário para manter o foco." },
      ],
    },
    en: {
      badge: "Smart nutrition",
      hero1: "Complete control of",
      hero2: "your nutrition",
      heroSub: "Log meals, track macros, hydration and evolve with real data — all in one place.",
      cta: "Start for free",
      login: "Sign in",
      featuresTitle: "A complete platform",
      featuresSub: "Everything you need to transform your diet.",
      howTitle: "Easy to use",
      howSub: "From sign up to results in just a few steps.",
      ctaFinal: "Ready to start?",
      ctaFinalSub: "Create your free account and start monitoring your nutrition today.",
      footer: "Built for people who take health seriously.",
      steps: [
        { n: "01", t: "Create your account", d: "Sign up in seconds with email or Google." },
        { n: "02", t: "Set your goals", d: "Define personalized calories, macros and hydration." },
        { n: "03", t: "Log meals", d: "Search 300k+ foods and add them to your day." },
        { n: "04", t: "Track progress", d: "Charts and calendar to keep you on track." },
      ],
    },
    es: {
      badge: "Nutrición inteligente",
      hero1: "Control total de",
      hero2: "tu nutrición",
      heroSub: "Registra comidas, sigue macros, hidratación y evoluciona con datos reales — todo en un solo lugar.",
      cta: "Empezar gratis",
      login: "Iniciar sesión",
      featuresTitle: "Una plataforma completa",
      featuresSub: "Todo lo que necesitas para transformar tu alimentación.",
      howTitle: "Fácil de usar",
      howSub: "Del registro a los resultados en pocos pasos.",
      ctaFinal: "¿Listo para empezar?",
      ctaFinalSub: "Crea tu cuenta gratis y empieza a monitorear tu nutrición hoy.",
      footer: "Hecho para quienes se toman la salud en serio.",
      steps: [
        { n: "01", t: "Crea tu cuenta", d: "Registro en segundos con email o Google." },
        { n: "02", t: "Configura tus metas", d: "Define calorías, macros e hidratación personalizados." },
        { n: "03", t: "Registra comidas", d: "Busca en 300k+ alimentos y agrégalos a tu día." },
        { n: "04", t: "Sigue la evolución", d: "Gráficos y calendario para mantener el foco." },
      ],
    },
  }

  const features = [
    {
      icon: "🍽️",
      title: { pt: "Registro de refeições", en: "Meal logging", es: "Registro de comidas" },
      desc: { pt: "Café da manhã, almoço, lanche e jantar com busca inteligente.", en: "Breakfast, lunch, snack and dinner with smart search.", es: "Desayuno, almuerzo, merienda y cena con búsqueda inteligente." },
      color: "from-violet-500/20 to-violet-500/5",
      border: "border-violet-500/20",
      icon_bg: "bg-violet-500/20",
    },
    {
      icon: "📊",
      title: { pt: "Macros em tempo real", en: "Real-time macros", es: "Macros en tiempo real" },
      desc: { pt: "Calorias, proteína, carboidratos e gordura atualizados ao vivo.", en: "Calories, protein, carbs and fat updated live.", es: "Calorías, proteína, carbos y grasa actualizados en vivo." },
      color: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/20",
      icon_bg: "bg-emerald-500/20",
    },
    {
      icon: "💧",
      title: { pt: "Controle de hidratação", en: "Hydration tracking", es: "Control de hidratación" },
      desc: { pt: "Registre água em ml ou L com copos visuais e metas personalizadas.", en: "Log water in ml or L with visual cups and custom goals.", es: "Registra agua en ml o L con vasos visuales y metas personalizadas." },
      color: "from-blue-500/20 to-blue-500/5",
      border: "border-blue-500/20",
      icon_bg: "bg-blue-500/20",
    },
    {
      icon: "📅",
      title: { pt: "Calendário de histórico", en: "History calendar", es: "Calendario de historial" },
      desc: { pt: "Visualize dias com indicadores de cumprimento de metas.", en: "View days with goal completion indicators.", es: "Visualiza días con indicadores de cumplimiento de metas." },
      color: "from-amber-500/20 to-amber-500/5",
      border: "border-amber-500/20",
      icon_bg: "bg-amber-500/20",
    },
    {
      icon: "📈",
      title: { pt: "Gráficos de evolução", en: "Progress charts", es: "Gráficos de evolución" },
      desc: { pt: "Barras semanais e mensais com linha de meta para cada macro.", en: "Weekly and monthly bars with goal line per macro.", es: "Barras semanales y mensuales con línea de meta por macro." },
      color: "from-rose-500/20 to-rose-500/5",
      border: "border-rose-500/20",
      icon_bg: "bg-rose-500/20",
    },
    {
      icon: "☁️",
      title: { pt: "Sincronização na nuvem", en: "Cloud sync", es: "Sincronización en la nube" },
      desc: { pt: "Dados seguros e acessíveis de qualquer dispositivo, sempre.", en: "Secure data accessible from any device, always.", es: "Datos seguros y accesibles desde cualquier dispositivo, siempre." },
      color: "from-cyan-500/20 to-cyan-500/5",
      border: "border-cyan-500/20",
      icon_bg: "bg-cyan-500/20",
    },
  ]

  const tx = texts[lang]

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">

      {/* Canvas de partículas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Gradientes de fundo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.15), transparent)" }} className="absolute inset-0" />
        <div style={{ background: "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(16,185,129,0.06), transparent)" }} className="absolute inset-0" />
        <div style={{ background: "radial-gradient(ellipse 50% 30% at 20% 60%, rgba(59,130,246,0.06), transparent)" }} className="absolute inset-0" />
      </div>

      {/* Textura de grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between bg-white/3 backdrop-blur-xl border border-white/8 rounded-2xl px-6 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="w-2 h-2 rounded-full bg-rose-500" />
              </div>
              <span style={{ fontFamily: "'Bungee', cursive" }} className="text-sm tracking-widest uppercase text-white">
                Macro Tracker
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex gap-1 mr-2">
                {[{ code: "pt", label: "PT" }, { code: "en", label: "EN" }, { code: "es", label: "ES" }].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => i18n.changeLanguage(l.code)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wider transition-all ${
                      lang === l.code
                        ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onLogin("login")}
                className="text-xs text-zinc-400 hover:text-white transition-all px-4 py-2 rounded-xl border border-white/10 hover:border-white/20"
              >
                {tx.login}
              </button>
              <button
                onClick={() => onLogin("cadastro")}
                className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl transition-all font-medium"
              >
                {tx.cta}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 pt-48 pb-32 px-6 text-center max-w-5xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-5 py-2 mb-10 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-xs text-violet-300 tracking-widest uppercase font-medium">{tx.badge}</span>
        </div>

        {/* Título */}
        <h1 className="text-5xl sm:text-7xl font-bold leading-none tracking-tight mb-6">
          <span className="block text-white mb-2">{tx.hero1}</span>
          <span className="block" style={{
            background: "linear-gradient(135deg, #a78bfa, #818cf8, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {tx.hero2}
          </span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          {tx.heroSub}
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-20">
          <button
            onClick={() => onLogin("cadastro")}
            className="group relative px-8 py-4 rounded-2xl text-sm font-semibold text-white overflow-hidden transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }} />
            <span className="relative">{tx.cta} →</span>
          </button>
          <button
            onClick={() => onLogin("login")}
            className="px-8 py-4 rounded-2xl text-sm text-zinc-300 hover:text-white border border-white/10 hover:border-white/25 transition-all hover:bg-white/5 backdrop-blur-sm"
          >
            {tx.login}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { val: "148+", label: { pt: "Alimentos locais", en: "Local foods", es: "Alimentos locales" }, color: "text-violet-400" },
            { val: "300k+", label: { pt: "Via API USDA", en: "Via USDA API", es: "Via API USDA" }, color: "text-emerald-400" },
            { val: "3", label: { pt: "Idiomas", en: "Languages", es: "Idiomas" }, color: "text-blue-400" },
          ].map((s, i) => (
            <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-5 backdrop-blur-sm">
              <p className={`text-3xl font-bold ${s.color} mb-1`}>{s.val}</p>
              <p className="text-xs text-zinc-500">{s.label[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-violet-400 uppercase tracking-widest mb-3 font-medium">Features</p>
            <h2 className="text-4xl font-bold text-white mb-4">{tx.featuresTitle}</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">{tx.featuresSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className={`relative bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-6 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 group overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.1), transparent 70%)" }}
                />
                <div className={`w-11 h-11 ${f.icon_bg} rounded-xl flex items-center justify-center text-xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{f.title[lang]}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{f.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-emerald-400 uppercase tracking-widest mb-3 font-medium">How it works</p>
            <h2 className="text-4xl font-bold text-white mb-4">{tx.howTitle}</h2>
            <p className="text-zinc-500">{tx.howSub}</p>
          </div>

          <div className="relative">
            {/* Linha conectora */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-violet-500/50 via-blue-500/30 to-transparent hidden sm:block" />

            <div className="space-y-4">
              {tx.steps.map((step, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm flex items-center justify-center relative z-10 group-hover:border-violet-500/40 group-hover:bg-violet-500/10 transition-all">
                    <span className="text-xs font-bold text-zinc-600 group-hover:text-violet-400 transition-colors">{step.n}</span>
                  </div>
                  <div className="flex-1 pt-4 pb-4 border-b border-white/5 last:border-0">
                    <h3 className="text-sm font-semibold text-white mb-1">{step.t}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-violet-500/10 to-blue-500/5 border border-violet-500/20 rounded-3xl p-16 overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.15), transparent)" }}
            />
            <div className="relative z-10">
              <p className="text-xs text-violet-400 uppercase tracking-widest mb-4 font-medium">Get started</p>
              <h2 className="text-4xl font-bold text-white mb-4">{tx.ctaFinal}</h2>
              <p className="text-zinc-400 mb-10 max-w-md mx-auto">{tx.ctaFinalSub}</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => onLogin("cadastro")}
                  className="group relative px-10 py-4 rounded-2xl text-sm font-semibold text-white overflow-hidden transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }} />
                  <span className="relative">{tx.cta} →</span>
                </button>
                <button
                  onClick={() => onLogin("login")}
                  className="px-10 py-4 rounded-2xl text-sm text-zinc-300 hover:text-white border border-white/10 hover:border-white/25 transition-all hover:bg-white/5"
                >
                  {tx.login}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            </div>
            <span style={{ fontFamily: "'Bungee', cursive" }} className="text-xs tracking-widest uppercase text-zinc-500">
              Macro Tracker
            </span>
          </div>
          <p className="text-xs text-zinc-600">{tx.footer}</p>
          <p className="text-xs text-zinc-700">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}