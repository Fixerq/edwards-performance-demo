'use client'

const steps = [
  {
    number: 1,
    label: 'Inbound inquiry',
    detail: 'Facebook, TikTok, referral',
    highlighted: false,
  },
  {
    number: 2,
    label: 'Instant AI response',
    detail: 'Seconds, not hours',
    highlighted: true,
  },
  {
    number: 3,
    label: 'Smart qualification',
    detail: 'Goals, budget, urgency',
    highlighted: true,
  },
  {
    number: 4,
    label: 'Acuity booked',
    detail: "Drops into Ed's calendar",
    highlighted: true,
  },
  {
    number: 5,
    label: "Ed's consultation",
    detail: 'You close',
    highlighted: false,
  },
]

export default function Funnel() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Desktop funnel */}
      <div className="hidden md:flex items-start justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-6 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-gray-600 via-gold to-gray-600 z-0" />

        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center text-center relative z-10 flex-1 px-2"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold mb-3 transition-all ${
                step.highlighted
                  ? 'bg-gold text-charcoal shadow-lg shadow-gold/30'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {step.number}
            </div>
            <p
              className={`text-sm font-semibold mb-1 ${
                step.highlighted ? 'text-gold' : 'text-gray-400'
              }`}
            >
              {step.label}
            </p>
            <p className="text-xs text-gray-500">{step.detail}</p>
          </div>
        ))}
      </div>

      {/* Mobile funnel */}
      <div className="md:hidden space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
              step.highlighted
                ? 'bg-gold/10 border border-gold/30'
                : 'bg-white/5 border border-white/10'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                step.highlighted
                  ? 'bg-gold text-charcoal'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {step.number}
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  step.highlighted ? 'text-gold' : 'text-gray-400'
                }`}
              >
                {step.label}
              </p>
              <p className="text-xs text-gray-500">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-8">
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2">
          <div className="w-3 h-3 rounded-full bg-gold" />
          <span className="text-xs text-gold font-medium">
            EngageAI handles this
          </span>
        </div>
      </div>
    </div>
  )
}
