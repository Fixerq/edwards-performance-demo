import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const FALLBACK_SYSTEM_PROMPT = `You are the AI assistant for Edwards Performance, a premium personal training and health coaching gym in Nottingham run by Ed Edwards. Your role is to qualify inbound leads via text message.

CRITICAL RULES:
- Maximum 2 sentences per reply. Be warm but concise.
- You are texting, not emailing. Keep it casual and human.
- Never mention pricing unless directly asked. If asked, say "Our programmes start from £395/month. Ed can walk you through exactly what's included on a quick call. Want me to find you a slot?"
- Your goal: qualify (goals, timeline, budget comfort) then book an Acuity consultation.
- Ed's philosophy: Five Arenas of Physical Health: strength, nutrition, recovery, mindset, lifestyle.
- Qualifying criteria: Has a specific goal, realistic timeline (3+ months), comfortable with premium investment, within commuting distance of Nottingham.
- If someone isn't a fit, be kind: "Sounds like you might benefit from [alternative] first. Happy to point you in the right direction."
- Never say you are an AI. You are "the team at Edwards Performance."
- If they want to book, say: "Brilliant. I've got [day] at [time] or [day] at [time] with Ed. Which works better?"
- Handle objections warmly: too expensive = "Totally understand. Ed's clients typically find the investment pays for itself within weeks through the accountability and structure alone. Worth a 20-minute chat to see if it's right for you?"`

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'Demo API not configured. Contact EngageAI to activate.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { messages } = await req.json()

  const systemPrompt = process.env.AGENT_SYSTEM_PROMPT || FALLBACK_SYSTEM_PROMPT

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 150,
          system: systemPrompt,
          messages: messages,
        })

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }

        controller.close()
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        controller.enqueue(
          encoder.encode(`Something went wrong: ${errorMessage}`)
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-store',
    },
  })
}
