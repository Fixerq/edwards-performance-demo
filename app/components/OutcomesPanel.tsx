'use client'

export default function OutcomesPanel() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Lead notification card */}
        <div className="bg-[#111] border-2 border-green-500/40 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider">
              Lead notification
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Name
              </p>
              <p className="text-white font-semibold">Sarah Mitchell</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Source
              </p>
              <p className="text-white">
                Facebook Ad{' '}
                <span className="text-gray-500">&#183; 2 mins ago</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Budget confirmed',
                  '3-month goal',
                  'Holiday deadline',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-xs bg-gold/10 text-gold border border-gold/20 rounded-full px-3 py-1 font-medium">
                  Acuity booked &#10003;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Acuity booking card */}
        <div className="bg-[#111] border-2 border-gold/40 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <h3 className="text-sm font-semibold text-gold uppercase tracking-wider">
              Acuity booking confirmed
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Date &amp; time
              </p>
              <p className="text-white font-semibold">
                Tuesday 18 Mar &#183; 9:30am
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Client
              </p>
              <p className="text-white">
                Sarah Mitchell - Initial consultation
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Goals
              </p>
              <p className="text-white">Weight loss + fitness</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Budget
              </p>
              <p className="text-gold font-semibold">
                &#163;395/mo confirmed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '100%', label: 'of leads touched instantly' },
          { value: '0 min', label: 'of your time to get them booked' },
          { value: '8', label: 'qualified leads/month to hit your growth target' },
          { value: '24/7', label: 'AI active when impulse strikes' },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-[#111] border border-white/10 rounded-xl p-5 text-center"
          >
            <p className="text-3xl font-bold text-gold font-playfair mb-2">
              {metric.value}
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
