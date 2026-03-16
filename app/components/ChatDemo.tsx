'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const examplePrompts = [
  'Hi, I saw your Facebook ad - how much does personal training cost?',
  'I want to lose weight before my holiday in 3 months',
]

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    setError(null)
    const userMessage: Message = { role: 'user', content: content.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Something went wrong')
        setIsLoading(false)
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        setError('Failed to read response')
        setIsLoading(false)
        return
      }

      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages([...updatedMessages, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        assistantContent += decoder.decode(value, { stream: true })
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: assistantContent },
        ])
      }
    } catch {
      setError('Failed to connect - check your internet connection')
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const resetConversation = () => {
    setMessages([])
    setError(null)
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Chat window */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0d0d0d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
              <span className="text-charcoal font-playfair font-bold text-sm">
                EP
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Edwards Performance
              </p>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online now
              </p>
            </div>
          </div>
          <button
            onClick={resetConversation}
            className="text-xs text-gray-500 hover:text-gold transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Reset
          </button>
        </div>

        {/* Messages area */}
        <div className="h-[400px] overflow-y-auto p-5 space-y-4 chat-scroll">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <span className="text-gold font-playfair font-bold text-xl">
                  EP
                </span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs">
                Type a message as if you were a lead inquiring about personal
                training
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center mr-2 shrink-0 mt-1">
                  <span className="text-charcoal font-playfair font-bold text-xs">
                    EP
                  </span>
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-gold text-charcoal rounded-br-md'
                    : 'bg-white/10 text-white rounded-bl-md'
                }`}
              >
                {message.content || (
                  <span className="text-gray-400">...</span>
                )}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center mr-2 shrink-0">
                <span className="text-charcoal font-playfair font-bold text-xs">
                  EP
                </span>
              </div>
              <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gold typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-gold typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-gold typing-dot" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-4 border-t border-white/10 bg-[#0d0d0d]"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gold text-charcoal font-semibold px-5 py-3 rounded-xl text-sm hover:bg-gold-light transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            Send
          </button>
        </form>
      </div>

      {/* Example prompts */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        {examplePrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => {
              setInput(prompt)
              inputRef.current?.focus()
            }}
            className="text-xs text-gray-400 bg-white/5 border border-white/10 rounded-lg px-3 py-2 hover:border-gold/30 hover:text-gold transition-all text-left"
          >
            &ldquo;{prompt}&rdquo;
          </button>
        ))}
      </div>
    </div>
  )
}
