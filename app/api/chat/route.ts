import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'Demo API not configured - contact EngageAI to activate',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { messages } = await req.json()

  const systemPrompt = process.env.AGENT_SYSTEM_PROMPT
  if (!systemPrompt) {
    return new Response(
      JSON.stringify({
        error: 'Agent not configured - contact EngageAI to activate',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

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
          encoder.encode(`\n\nSomething went wrong: ${errorMessage}`)
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
