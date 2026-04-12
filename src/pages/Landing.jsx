import { useTranslation } from "react-i18next"

export default function Landing({ onLogin }) {
  const { t, i18n } = useTranslation()

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      title: { pt: "Registro diário", en: "Daily logging", es: "Registro diario" },
      desc: { pt: "Registre café da manhã, almoço, lanche e jantar com facilidade.", en: "Log breakfast, lunch, snack and dinner with ease.", es: "Registra desayuno, almuerzo, merienda y cena fácilmente." },
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
      title: { pt: "Base de 300k+ alimentos", en: "300k+ food database", es: "Base de 300k+ alimentos" },
      desc: { pt: "Banco local em português + API USDA com centenas de milhares de itens.", en: "Local database + USDA API with hundreds of thousands of items.", es: "Base local + API USDA con cientos de miles de alimentos." },
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
      ),
      title: { pt: "Gráficos semanais", en: "Weekly charts", es: "Gráficos semanales" },
      desc: { pt: "Visualize sua evolução de macros e hidratação por semana e mês.", en: "Track your macro and hydration progress by week and month.", es: "Visualiza tu evolución de macros e hidratación por semana y mes." },
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      title: { pt: "Calendário de histórico", en: "History calendar", es: "Calendario de historial" },
      desc: { pt: "Veja seus dias com indicadores visuais de cumprimento de metas.", en: "See your days with visual goal completion indicators.", es: "Ve tus días con indicadores visuales de cumplimiento de metas." },
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      title: { pt: "Alimentos favoritos", en: "Favorite foods", es: "Alimentos favoritos" },
      desc: { pt: "Salve seus alimentos preferidos para adicionar com um clique.", en: "Save your favorite foods to add with one click.", es: "Guarda tus alimentos favoritos para añadir con un clic." },
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: { pt: "Dados na nuvem", en: "Cloud sync", es: "Datos en la nube" },
      desc: { pt: "Seus dados sincronizados com segurança. Acesse de qualquer dispositivo.", en: "Your data securely synced. Access from any device.", es: "Tus datos sincronizados de forma segura. Accede desde cualquier dispositivo." },
    },
  ]

  const lang = i18n.language.startsWith("en") ? "en" : i18n.language.startsWith("es") ? "es" : "pt"

  const texts = {
    pt: {
      hero: "Controle sua nutrição com precisão",
      heroSub: "Registre refeições, acompanhe macros, beba mais água e evolua todos os dias.",
      cta: "Começar agora",
      login: "Entrar",
      featuresTitle: "Tudo que você precisa",
      featuresSubtitle: "Uma plataforma completa para acompanhar sua alimentação e atingir seus objetivos.",
      howTitle: "Como funciona",
      steps: [
        { n: "01", t: "Crie sua conta", d: "Cadastro rápido com email ou Google em segundos." },
        { n: "02", t: "Defina suas metas", d: "Configure calorias, proteínas, carboidratos, gordura e água." },
        { n: "03", t: "Registre suas refeições", d: "Busque alimentos e adicione às suas refeições do dia." },
        { n: "04", t: "Acompanhe sua evolução", d: "Veja gráficos e calendário de histórico para manter o foco." },
      ],
      footer: "Feito para quem leva saúde a sério.",
    },
    en: {
      hero: "Track your nutrition with precision",
      heroSub: "Log meals, track macros, drink more water and improve every day.",
      cta: "Get started",
      login: "Sign in",
      featuresTitle: "Everything you need",
      featuresSubtitle: "A complete platform to track your diet and reach your goals.",
      howTitle: "How it works",
      steps: [
        { n: "01", t: "Create your account", d: "Quick signup with email or Google in seconds." },
        { n: "02", t: "Set your goals", d: "Configure calories, protein, carbs, fat and water targets." },
        { n: "03", t: "Log your meals", d: "Search foods and add them to your daily meals." },
        { n: "04", t: "Track your progress", d: "View charts and history calendar to stay on track." },
      ],
      footer: "Built for people who take health seriously.",
    },
    es: {
      hero: "Controla tu nutrición con precisión",
      heroSub: "Registra comidas, sigue tus macros, bebe más agua y mejora cada día.",
      cta: "Empezar ahora",
      login: "Iniciar sesión",
      featuresTitle: "Todo lo que necesitas",
      featuresSubtitle: "Una plataforma completa para seguir tu alimentación y alcanzar tus objetivos.",
      howTitle: "Cómo funciona",
      steps: [
        { n: "01", t: "Crea tu cuenta", d: "Registro rápido con email o Google en segundos." },
        { n: "02", t: "Define tus metas", d: "Configura calorías, proteínas, carbos, grasa y agua." },
        { n: "03", t: "Registra tus comidas", d: "Busca alimentos y agrégalos a tus comidas del día." },
        { n: "04", t: "Sigue tu evolución", d: "Ve gráficos y calendario de historial para mantener el foco." },
      ],
      footer: "Hecho para quienes se toman la salud en serio.",
    },
  }

  const tx = texts[lang]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <span style={{ fontFamily: "'Bungee', cursive" }} className="text-sm tracking-widest uppercase text-white">
              Macro Tracker
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Seletor de idioma */}
            <div className="hidden sm:flex gap-1">
              {[{ code: "pt", label: "PT" }, { code: "en", label: "EN" }, { code: "es", label: "ES" }].map((l) => (
                <button
                  key={l.code}
                  onClick={() => i18n.changeLanguage(l.code)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wider border transition-all ${
                    lang === l.code
                      ? "bg-violet-500/20 text-violet-400 border-violet-500/30"
                      : "text-zinc-500 border-transparent hover:text-zinc-300"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => onLogin("login")}
              className="text-sm text-zinc-400 hover:text-white transition-all px-4 py-2 rounded-lg border border-white/10 hover:border-white/20"
            >
              {tx.login}
            </button>
            <button
              onClick={() => onLogin("cadastro")}
              className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-all font-medium"
            >
              {tx.cta}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-28 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          <span className="text-xs text-violet-400 tracking-wider uppercase">Macro Tracker</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-semibold text-white leading-tight tracking-tight mb-6">
          {tx.hero.split(" ").map((word, i, arr) =>
            i === arr.length - 1
              ? <span key={i} className="text-violet-400"> {word}</span>
              : <span key={i}> {word}</span>
          )}
        </h1>

        <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
          {tx.heroSub}
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => onLogin("cadastro")}
            className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3.5 rounded-xl text-sm font-medium transition-all"
          >
            {tx.cta} →
          </button>
          <button
            onClick={() => onLogin("login")}
            className="text-zinc-400 hover:text-white px-8 py-3.5 rounded-xl text-sm border border-white/10 hover:border-white/20 transition-all"
          >
            {tx.login}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-20 pt-10 border-t border-white/5">
          {[
            { val: "148+", label: { pt: "alimentos locais", en: "local foods", es: "alimentos locales" } },
            { val: "300k+", label: { pt: "via API USDA", en: "via USDA API", es: "via API USDA" } },
            { val: "3", label: { pt: "idiomas suportados", en: "supported languages", es: "idiomas soportados" } },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-semibold text-white">{s.val}</p>
              <p className="text-xs text-zinc-500 mt-1">{s.label[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">{tx.featuresTitle}</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">{tx.featuresSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white/3 border border-white/6 rounded-2xl p-6 hover:border-violet-500/20 hover:bg-violet-500/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4 group-hover:bg-violet-500/20 transition-all">
                  {f.icon}
                </div>
                <h3 className="text-sm font-medium text-white mb-2">{f.title[lang]}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">{tx.howTitle}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tx.steps.map((step, i) => (
              <div key={i} className="bg-white/3 border border-white/6 rounded-2xl p-6 flex gap-4">
                <span className="text-3xl font-semibold text-white/10 flex-shrink-0">{step.n}</span>
                <div>
                  <h3 className="text-sm font-medium text-white mb-1">{step.t}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">{tx.hero}</h2>
          <p className="text-zinc-500 mb-8">{tx.heroSub}</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => onLogin("cadastro")}
              className="bg-violet-600 hover:bg-violet-500 text-white px-10 py-4 rounded-xl text-sm font-medium transition-all"
            >
              {tx.cta} →
            </button>
            <button
              onClick={() => onLogin("login")}
              className="text-zinc-400 hover:text-white px-10 py-4 rounded-xl text-sm border border-white/10 hover:border-white/20 transition-all"
            >
              {tx.login}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
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