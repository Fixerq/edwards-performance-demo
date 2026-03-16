import Funnel from './components/Funnel'
import ChatDemo from './components/ChatDemo'
import OutcomesPanel from './components/OutcomesPanel'

export default function Home() {
  return (
    <main className="min-h-screen bg-charcoal">
      {/* Section 1 - Hero + Funnel */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto text-center mb-16">
          {/* Logo */}
          <div className="mb-6">
            <span className="text-7xl md:text-8xl font-playfair font-bold text-gold">
              EP
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-3">
            Edwards Performance
          </h1>
          <p className="text-lg text-gold/80 font-inter tracking-widest uppercase text-sm">
            Performance Through Health
          </p>
        </div>

        {/* Funnel */}
        <Funnel />
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Section 2 - Live AI Chat Demo */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-3">
            Try it - type in as a prospect
          </h2>
          <p className="text-gray-400 text-base">
            This is exactly what your leads will experience
          </p>
        </div>

        <ChatDemo />
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Section 3 - Outcomes Panel */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-3">
            What you see after a qualified lead
          </h2>
        </div>

        <OutcomesPanel />
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-gray-600">
            Powered by{' '}
            <span className="text-gold/60">EngageAI</span>
            {' '}- AI automation for growth-focused businesses
          </p>
        </div>
      </footer>
    </main>
  )
}
