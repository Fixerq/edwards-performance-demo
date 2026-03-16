'use client'

import { useState, useEffect, useRef } from 'react'

const BRAND = {
  charcoal: '#1A1A1A',
  gold: '#C9962A',
  darkGrey: '#2A2A2A',
  midGrey: '#8A8A8A',
  cream: '#F5F0E8',
  white: '#FFFFFF',
  green: '#22C55E',
}

// ─── Fade-in on scroll ───
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Chat bubble ───
function ChatBubble({ role, text, isTyping }: { role: string; text?: string; isTyping?: boolean }) {
  const isAgent = role === 'assistant'
  return (
    <div style={{ display: 'flex', justifyContent: isAgent ? 'flex-start' : 'flex-end', marginBottom: 12 }}>
      <div
        style={{
          maxWidth: '80%',
          padding: '12px 16px',
          borderRadius: isAgent ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
          background: isAgent ? BRAND.darkGrey : BRAND.gold,
          color: BRAND.white,
          fontSize: 14,
          lineHeight: 1.5,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {isTyping ? (
          <div style={{ display: 'flex', gap: 4, padding: '4px 8px' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6, height: 6, borderRadius: '50%', background: BRAND.gold,
                  animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        ) : text}
      </div>
    </div>
  )
}

// ─── Gold divider ───
function GoldLine() {
  return (
    <div style={{
      height: 1,
      background: `linear-gradient(90deg, transparent, ${BRAND.gold}40, transparent)`,
      maxWidth: 900,
      margin: '0 auto',
    }} />
  )
}

// ─── Main page ───
export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  const [roiClients, setRoiClients] = useState(4)

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStreamingText('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok || !res.body) {
        throw new Error('Failed to get response')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      setLoading(false)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setStreamingText(fullText)
      }

      setMessages([...newMessages, { role: 'assistant', content: fullText }])
      setStreamingText('')
    } catch {
      setLoading(false)
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Hey! Thanks for reaching out. What are you looking to achieve with your training?'
      }])
    }
  }

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, loading, streamingText])

  const roiRevenue = roiClients * 395
  const roiProfit = roiRevenue - 1500
  const roiMultiple = (roiRevenue / 1500).toFixed(1)

  const sectionStyle: React.CSSProperties = { padding: '80px 24px', maxWidth: 900, margin: '0 auto' }

  return (
    <div style={{ background: BRAND.charcoal, color: BRAND.white, fontFamily: "'Inter', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ═══════════ HERO ═══════════ */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${BRAND.gold}08 0%, transparent 60%)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: BRAND.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: BRAND.charcoal }}>EP</div>
            <span style={{ fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: BRAND.midGrey }}>Edwards Performance</span>
          </div>
          <h1 className="font-playfair" style={{ fontSize: 'clamp(32px, 6vw, 56px)', lineHeight: 1.15, marginBottom: 24, fontWeight: 600 }}>
            Your next client just messaged.<br />
            <span style={{ color: BRAND.gold }}>Nobody replied.</span>
          </h1>
          <p style={{ fontSize: 18, color: BRAND.midGrey, maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.7, fontWeight: 300 }}>
            This is the system that makes sure that never happens again, and turns every enquiry into a booked consultation while you&apos;re training.
          </p>
          <a href="#problem" style={{ display: 'inline-block', padding: '14px 32px', background: BRAND.gold, color: BRAND.charcoal, borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
            See how it works ↓
          </a>
        </div>
      </section>

      <GoldLine />

      {/* ═══════════ THE PROBLEM ═══════════ */}
      <section id="problem" style={sectionStyle}>
        <FadeIn>
          <p style={{ color: BRAND.gold, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>The problem right now</p>
          <h2 className="font-playfair" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16, fontWeight: 600 }}>
            You&apos;re losing money every single day
          </h2>
          <p style={{ color: BRAND.midGrey, fontSize: 16, lineHeight: 1.7, marginBottom: 40, maxWidth: 600 }}>
            These aren&apos;t hypotheticals. This is what&apos;s happening right now without a system in place.
          </p>
        </FadeIn>

        {[
          { num: '01', title: 'Leads go cold in minutes, not days', desc: "Someone sees your ad at 10pm, fills in the form, and waits. By the time you reply tomorrow morning, they've already enquired with three other PTs. The average lead response time in fitness is 47 hours. By then, they've moved on." },
          { num: '02', title: 'Acuity calls interrupting every session', desc: "You're mid-set with a client paying £100/hour and your phone buzzes. Do you answer and risk your current client's experience, or ignore it and risk losing a new one? Neither option is acceptable at the level you're operating at." },
          { num: '03', title: "No idea who's serious and who's wasting your time", desc: "Without qualification, every lead looks the same. You're spending 20 minutes on a consultation call only to discover they can't afford it, live 40 miles away, or want something you don't offer." },
        ].map((card, i) => (
          <FadeIn key={i} delay={(i + 1) * 0.1}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 28, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 18, fontWeight: 700, minWidth: 40, color: BRAND.gold, textAlign: 'center' }}>{card.num}</div>
                <div>
                  <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 600 }}>{card.title}</h3>
                  <p style={{ color: BRAND.midGrey, fontSize: 15, lineHeight: 1.6 }}>{card.desc}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </section>

      <GoldLine />

      {/* ═══════════ THE SYSTEM ═══════════ */}
      <section style={sectionStyle}>
        <FadeIn>
          <p style={{ color: BRAND.gold, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>The system</p>
          <h2 className="font-playfair" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16, fontWeight: 600 }}>
            From ad click to booked consultation<br />
            <span style={{ color: BRAND.gold }}>without you lifting a finger</span>
          </h2>
          <p style={{ color: BRAND.midGrey, fontSize: 16, lineHeight: 1.7, marginBottom: 48, maxWidth: 600 }}>
            Here&apos;s exactly what happens when someone clicks your ad or finds your website. Every step is automated. You only show up for the consultation itself.
          </p>
        </FadeIn>

        {[
          { num: 1, title: 'Lead comes in', desc: 'From Facebook, TikTok, Instagram, your website, or a referral link. The EngageAI platform captures their details instantly (name, number, source) and triggers the next step.', tag: 'Instant', tagColor: BRAND.gold },
          { num: 2, title: 'AI responds in under 60 seconds', desc: 'While other PTs take 47 hours to reply, your AI agent texts them back immediately. Warm, personal, on-brand. Trained on your Five Arenas philosophy, your tone, and your qualifying criteria.', tag: '< 60 seconds', tagColor: BRAND.green },
          { num: 3, title: 'Smart qualification conversation', desc: "The AI asks the right questions naturally: What are your goals? What's your timeline? Have you invested in coaching before? It filters out tyre-kickers and identifies serious prospects, so you never waste a consultation.", tag: 'Automated', tagColor: BRAND.gold },
          { num: 4, title: 'Consultation booked into Acuity', desc: "Qualified leads get offered available slots directly from your Acuity calendar. They pick a time, it's confirmed, and a reminder sequence kicks in. No back-and-forth, no phone tag, no interruptions.", tag: 'Hands-free', tagColor: BRAND.green },
          { num: 5, title: 'You walk in fully briefed', desc: "Before you say hello, you know their name, goals, budget comfort level, timeline, and what motivated them. You walk into every consultation ready to convert, because the AI has already done the groundwork.", tag: 'You start here', tagColor: BRAND.gold },
        ].map((step, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div style={{ position: 'relative', padding: '24px 24px 24px 72px', borderLeft: step.num < 5 ? `2px solid ${BRAND.gold}30` : '2px solid transparent' }}>
              <div style={{ position: 'absolute', left: -16, top: 24, width: 32, height: 32, borderRadius: '50%', background: BRAND.gold, color: BRAND.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{step.num}</div>
              <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, background: `${step.tagColor}20`, color: step.tagColor, marginBottom: 8 }}>{step.tag}</span>
              <h3 style={{ fontSize: 18, margin: '8px 0', fontWeight: 600 }}>{step.title}</h3>
              <p style={{ color: BRAND.midGrey, fontSize: 15, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          </FadeIn>
        ))}

        <FadeIn delay={0.5}>
          <div style={{ marginTop: 32, padding: 24, borderRadius: 12, background: `${BRAND.gold}10`, border: `1px solid ${BRAND.gold}30`, textAlign: 'center' }}>
            <p style={{ color: BRAND.gold, fontWeight: 600, fontSize: 15 }}>
              Steps 1 to 4 happen automatically, 24 hours a day, 365 days a year.
            </p>
            <p style={{ color: BRAND.midGrey, fontWeight: 400, fontSize: 14, marginTop: 6 }}>
              You only show up at step 5, fully prepared, with a qualified prospect who&apos;s already excited to work with you.
            </p>
          </div>
        </FadeIn>
      </section>

      <GoldLine />

      {/* ═══════════ LIVE DEMO ═══════════ */}
      <section style={sectionStyle}>
        <FadeIn>
          <p style={{ color: BRAND.gold, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>Live demo</p>
          <h2 className="font-playfair" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16, fontWeight: 600 }}>
            Try it yourself: text as if you&apos;re a lead
          </h2>
          <p style={{ color: BRAND.midGrey, fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 600 }}>
            This is the actual AI agent, trained on your brand, running live right now. Type anything a real lead would message and watch how it qualifies them.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div style={{ background: BRAND.darkGrey, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', maxWidth: 480, margin: '0 auto', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            {/* Chat header */}
            <div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: BRAND.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: BRAND.charcoal }}>EP</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Edwards Performance</div>
                <div style={{ fontSize: 12, color: BRAND.green, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.green, animation: 'pulse 2s infinite' }} />
                  Online now · replies in seconds
                </div>
              </div>
              <button
                onClick={() => { setMessages([]); setStreamingText('') }}
                style={{ marginLeft: 'auto', padding: '6px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: BRAND.midGrey, cursor: 'pointer', fontSize: 12 }}
              >
                Reset
              </button>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="chat-scroll" style={{ height: 340, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column' }}>
              {messages.length === 0 && !streamingText && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: BRAND.midGrey, gap: 16 }}>
                  <p style={{ fontSize: 14 }}>Type a message as if you&apos;re a lead...</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                    {['Hi, I saw your ad. Do you do personal training?', 'I need to lose 2 stone before my wedding', "How much is it? I've been quoted £200/month elsewhere"].map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: BRAND.cream, cursor: 'pointer', fontSize: 13, textAlign: 'left', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = BRAND.gold + '50'; (e.target as HTMLElement).style.background = `${BRAND.gold}08` }}
                        onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                      >
                        &ldquo;{q}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role} text={m.content} />
              ))}
              {streamingText && <ChatBubble role="assistant" text={streamingText} />}
              {loading && <ChatBubble role="assistant" isTyping />}
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Type a message..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 16px', color: BRAND.white, fontSize: 14 }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !!streamingText}
                style={{ padding: '10px 20px', background: BRAND.gold, border: 'none', borderRadius: 8, color: BRAND.charcoal, fontWeight: 600, cursor: 'pointer', fontSize: 14, opacity: (loading || streamingText) ? 0.5 : 1 }}
              >
                Send
              </button>
            </div>
          </div>
        </FadeIn>

        {/* What Ed sees */}
        <FadeIn delay={0.3}>
          <div style={{ marginTop: 48 }}>
            <h3 className="font-playfair" style={{ fontSize: 24, textAlign: 'center', marginBottom: 8 }}>
              And here&apos;s what <span style={{ color: BRAND.gold }}>you</span> receive
            </h3>
            <p style={{ color: BRAND.midGrey, fontSize: 15, textAlign: 'center', marginBottom: 24 }}>
              Once the AI qualifies and books them, this notification lands on your phone before the consultation:
            </p>

            <div style={{ maxWidth: 420, margin: '0 auto', background: BRAND.darkGrey, borderRadius: 16, overflow: 'hidden', border: `1px solid ${BRAND.gold}30`, boxShadow: `0 0 40px ${BRAND.gold}10` }}>
              <div style={{ padding: '16px 20px', background: `${BRAND.gold}15`, borderBottom: `1px solid ${BRAND.gold}20`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: BRAND.gold }}>●</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>New Qualified Lead: Booked</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: BRAND.gold }}>Just now</span>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  {[
                    { label: 'Name', value: 'Sarah Mitchell' },
                    { label: 'Source', value: 'Facebook Ad' },
                    { label: 'Goal', value: 'Lose 2 stone for wedding' },
                    { label: 'Timeline', value: '6 months' },
                    { label: 'Budget', value: '£395/mo confirmed ✓' },
                    { label: 'Consultation', value: 'Tue 18 Mar, 9:30am' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 11, color: BRAND.midGrey, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: 16, background: 'rgba(34,197,94,0.08)', borderRadius: 8, border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div style={{ fontSize: 13, color: BRAND.green, fontWeight: 600, marginBottom: 4 }}>AI Summary</div>
                  <div style={{ fontSize: 13, color: BRAND.midGrey, lineHeight: 1.5 }}>
                    Highly motivated. Wedding in September. Has trained before but inconsistently. Comfortable with premium pricing. Responded well to Five Arenas framework. High conversion probability.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <GoldLine />

      {/* ═══════════ BEFORE / AFTER ═══════════ */}
      <section style={sectionStyle}>
        <FadeIn>
          <p style={{ color: BRAND.gold, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>The transformation</p>
          <h2 className="font-playfair" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 48, fontWeight: 600 }}>
            This week vs. <span style={{ color: BRAND.gold }}>next week</span>
          </h2>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <FadeIn delay={0.1}>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 28, border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
              <div style={{ fontSize: 14, color: BRAND.midGrey, fontWeight: 600, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 }}>Without a system</div>
              {[
                'Leads sit unanswered for 24 to 48 hours',
                "No way to tell who's serious",
                'Phone ringing during client sessions',
                '20-min consultations with tyre-kickers',
                'No pipeline, no visibility on what\'s coming',
                'Growth capped by your personal bandwidth',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: BRAND.midGrey, fontSize: 16, lineHeight: 1.6 }}>✗</span>
                  <span style={{ color: BRAND.midGrey, fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div style={{ background: `${BRAND.gold}06`, borderRadius: 16, padding: 28, border: `1px solid ${BRAND.gold}25`, height: '100%' }}>
              <div style={{ fontSize: 14, color: BRAND.gold, fontWeight: 600, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 }}>With EngageAI</div>
              {[
                'Every lead contacted in under 60 seconds',
                'Only pre-qualified prospects reach your diary',
                'Zero interruptions. AI handles it all',
                'Full brief on every lead before you meet them',
                'Complete pipeline from ad click to booking',
                'System scales to 4 sites with no extra work',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: BRAND.green, fontSize: 16, lineHeight: 1.6 }}>✓</span>
                  <span style={{ color: BRAND.cream, fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <GoldLine />

      {/* ═══════════ ROI CALCULATOR ═══════════ */}
      <section style={sectionStyle}>
        <FadeIn>
          <p style={{ color: BRAND.gold, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>The numbers</p>
          <h2 className="font-playfair" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16, fontWeight: 600 }}>
            Pays for itself with<br />
            <span style={{ color: BRAND.gold }}>just 4 clients per month</span>
          </h2>
          <p style={{ color: BRAND.midGrey, fontSize: 16, lineHeight: 1.7, marginBottom: 48, maxWidth: 600 }}>
            Your cap is 4 new clients per month, and every one of them pays £395/month <em>recurring</em>. That means the system doesn&apos;t just pay for itself once. It compounds.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div style={{ background: BRAND.darkGrey, borderRadius: 16, padding: 32, border: '1px solid rgba(255,255,255,0.06)', maxWidth: 560, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: BRAND.midGrey }}>New clients per month</span>
                <span className="font-playfair" style={{ fontSize: 24, fontWeight: 700, color: BRAND.gold }}>{roiClients}</span>
              </div>
              <input
                type="range" min={1} max={8} value={roiClients}
                onChange={(e) => setRoiClients(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: BRAND.midGrey, marginTop: 4 }}>
                <span>1 (conservative)</span><span>8 (with paid ads)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 12, marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <span style={{ color: BRAND.midGrey, fontSize: 14 }}>New monthly recurring revenue</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: BRAND.green }}>£{roiRevenue.toLocaleString()}/mo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <span style={{ color: BRAND.midGrey, fontSize: 14 }}>EngageAI investment</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: BRAND.midGrey }}>–£1,500/mo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: `${BRAND.gold}12`, borderRadius: 8, border: `1px solid ${BRAND.gold}30` }}>
                <span style={{ color: BRAND.gold, fontSize: 14, fontWeight: 600 }}>Net new profit</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: roiProfit > 0 ? BRAND.gold : BRAND.midGrey }}>£{roiProfit.toLocaleString()}/mo</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="font-playfair" style={{ fontSize: 56, fontWeight: 700, color: BRAND.gold, lineHeight: 1 }}>
                {roiMultiple}x
              </div>
              <div style={{ color: BRAND.midGrey, fontSize: 14, marginTop: 8 }}>return on your investment</div>
              {roiClients >= 4 && (
                <div style={{ marginTop: 12, fontSize: 13, color: BRAND.green, fontWeight: 500 }}>
                  That&apos;s £{(roiProfit * 12).toLocaleString()} net new profit per year, and it compounds as clients stay month after month
                </div>
              )}
              {roiClients < 4 && roiClients >= 2 && (
                <div style={{ marginTop: 12, fontSize: 13, color: BRAND.midGrey, fontWeight: 400 }}>
                  Remember: these are recurring clients. By month 3, you&apos;ll have {roiClients * 3} active clients from the system alone.
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 40 }}>
            {[
              { value: '0 mins', label: 'of your time per lead' },
              { value: '< 60s', label: 'response time, every time' },
              { value: '24/7', label: 'always on, even at 2am' },
              { value: '100%', label: 'of enquiries contacted' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="font-playfair" style={{ fontSize: 28, fontWeight: 700, color: BRAND.gold, marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: BRAND.midGrey }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <GoldLine />

      {/* ═══════════ WHAT'S INCLUDED ═══════════ */}
      <section style={sectionStyle}>
        <FadeIn>
          <p style={{ color: BRAND.gold, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>What&apos;s included</p>
          <h2 className="font-playfair" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16, fontWeight: 600 }}>
            Your complete lead-to-client system<br />
            <span style={{ color: BRAND.gold }}>for £1,500/month + VAT</span>
          </h2>
          <p style={{ color: BRAND.midGrey, fontSize: 16, lineHeight: 1.7, marginBottom: 40, maxWidth: 600 }}>
            This isn&apos;t software you have to learn. It&apos;s a fully managed system. We build it, run it, and optimise it every month.
          </p>
        </FadeIn>

        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          {[
            { num: '01', title: 'Custom AI Lead Qualification Agent', desc: 'Trained on your brand, your Five Arenas philosophy, your pricing, and your tone of voice. Handles objections, qualifies on goals, budget, and timeline, then books consultations. All via SMS, 24/7.' },
            { num: '02', title: 'EngageAI CRM Platform', desc: 'Full pipeline management with every lead tracked from first touch to booked consultation. See exactly where every prospect is at any moment. No more guessing.' },
            { num: '03', title: 'Facebook & TikTok Lead Capture', desc: "Native integrations with your ad accounts. The moment someone fills in a lead form, they're captured and being contacted within seconds. No manual data entry, ever." },
            { num: '04', title: 'Acuity Calendar Integration', desc: 'The AI books directly into your existing Acuity calendar. Qualified leads pick a slot, get automatic confirmations and reminders. No back-and-forth scheduling.' },
            { num: '05', title: 'Real-time Lead Notifications', desc: "The moment a consultation is booked, you get a full brief on your phone: goals, budget, timeline, motivation, and the AI's assessment. Walk into every meeting prepared to close." },
            { num: '06', title: 'Monthly Optimisation & Reporting', desc: "We review your funnel every month, tune the AI's responses based on what's actually converting, and send you a clear performance report. This gets better over time." },
            { num: '07', title: 'Built to Scale to 4 Sites', desc: 'Designed from day one for your expansion plan. When site two opens, the system duplicates. Same quality, same automation, no additional complexity for you.' },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '20px 0', borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 700, minWidth: 40, textAlign: 'center', color: BRAND.gold }}>{item.num}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{item.title}</h3>
                  <p style={{ color: BRAND.midGrey, fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.6}>
          <div style={{ marginTop: 40, padding: 32, background: `linear-gradient(135deg, ${BRAND.gold}12, ${BRAND.gold}06)`, borderRadius: 16, border: `1px solid ${BRAND.gold}25`, textAlign: 'center', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="font-playfair" style={{ fontSize: 22, color: BRAND.gold, marginBottom: 8, fontWeight: 600 }}>Setup: £2,997 + VAT</div>
            <p style={{ color: BRAND.midGrey, fontSize: 15, lineHeight: 1.6 }}>
              One-off setup fee covers full system build, AI training, integrations, testing, and go-live. Your system can be up and running within 7 working days.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════ FOOTER CTA ═══════════ */}
      <section style={{ padding: '80px 24px 48px', textAlign: 'center' }}>
        <FadeIn>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 className="font-playfair" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16, fontWeight: 600 }}>
              Ready to stop losing leads?
            </h2>
            <p style={{ color: BRAND.midGrey, fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
              Your system can be built, tested, and live within 7 working days of signing.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 36px', background: BRAND.gold, borderRadius: 12, color: BRAND.charcoal, fontWeight: 700, fontSize: 17 }}>
              Let&apos;s get started →
            </div>
          </div>
        </FadeIn>
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', color: BRAND.midGrey, fontSize: 12 }}>
          Powered by EngageAI. AI automation for growth-focused businesses.
        </div>
      </section>
    </div>
  )
}
