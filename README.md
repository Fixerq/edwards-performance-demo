# Edwards Performance - EngageAI Demo

A live interactive demo showing the EngageAI lead qualification and booking system, built specifically for Edwards Performance, Nottingham.

Built with Next.js 14, Tailwind CSS, and the Anthropic API.

---

## What this is

A prospect-facing demo hosted on a public URL. Ed can open it on any device, type in as a lead, and experience exactly what his inbound prospects will see - a live AI agent that qualifies, handles objections, and guides toward booking.

---

## Local setup

### 1. Clone the repo

```
git clone https://github.com/YOUR_ORG/edwards-performance-demo.git
cd edwards-performance-demo
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Copy the example env file:

```
cp .env.local.example .env.local
```

Open `.env.local` and fill in both values:

```
ANTHROPIC_API_KEY=sk-ant-...
AGENT_SYSTEM_PROMPT="paste the full agent system prompt here in quotes"
```

Both are required. The app will show a friendly error in the chat UI if either is missing - it will not crash.

### 4. Run locally

```
npm run dev
```

Open http://localhost:3000

---

## Deploying to Vercel

### First deploy

1. Push the repo to GitHub (or GitLab / Bitbucket)
2. Go to https://vercel.com and click "Add New Project"
3. Import the repo
4. Before clicking Deploy, open "Environment Variables" and add:
   - `ANTHROPIC_API_KEY` - your Anthropic API key
   - `AGENT_SYSTEM_PROMPT` - the full agent system prompt (paste as plain text, no surrounding quotes needed in the Vercel UI)
5. Click Deploy

Vercel will give you a URL like: `https://edwards-performance-demo.vercel.app`

That is the link you send to Ed.

### Updating the deployment

Any push to the main branch auto-deploys. No action needed.

### Updating environment variables

Go to Vercel > Project > Settings > Environment Variables. Edit the value, then go to Deployments and trigger a redeploy for changes to take effect.

---

## Updating the agent

The AI agent's behaviour is controlled entirely by the `AGENT_SYSTEM_PROMPT` environment variable in Vercel. You never need to touch the code to change how the agent responds.

To update the agent:
1. Go to Vercel > Project > Settings > Environment Variables
2. Edit `AGENT_SYSTEM_PROMPT`
3. Go to Deployments > click the three dots on the latest deployment > Redeploy

Changes are live in under 60 seconds.

---

## Customising for other clients

This demo can be reused for any EngageAI prospect. To white-label for a new client:

1. Fork or duplicate the repo
2. Update the branding (logo, colours, name) in:
   - `app/page.tsx` - hero section and copy
   - `app/globals.css` - colour variables
   - `tailwind.config.ts` - extended colour palette
3. Update `AGENT_SYSTEM_PROMPT` in Vercel with the new client's knowledge base
4. Deploy as a new Vercel project

Each client gets their own URL and their own isolated agent.

---

## Project structure

```
edwards-performance-demo/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        - Anthropic streaming API route
│   ├── components/
│   │   ├── ChatDemo.tsx        - live AI chat interface
│   │   ├── Funnel.tsx          - 5-step lead journey visual
│   │   └── OutcomesPanel.tsx   - lead notification + booking cards
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                - main page, assembles all sections
├── .env.local.example          - required env vars template
├── .gitignore
├── next.config.mjs
├── package.json
├── README.md
└── tailwind.config.ts
```

---

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key. Starts with `sk-ant-` |
| `AGENT_SYSTEM_PROMPT` | Yes | Full system prompt controlling agent behaviour |

---

## Notes for the sales meeting

- Send the Vercel URL to Ed before the meeting so he can try it on his phone
- Suggested demo flow:
  1. Walk through the funnel overview at the top
  2. Ask Ed to type in as if he were a cold lead from Facebook
  3. Let the conversation run - do not steer it
  4. Point out the outcomes panel - this is what he would see in the EngageAI CRM
- If Ed asks how it knows about his gym - explain the knowledge base and that everything in the agent is built around his business, his pricing, his language
- The agent is deliberately limited to 300 tokens per response to keep it punchy and SMS-like - this is intentional, not a limitation

---

## Built by

EngageAI - AI automation for growth-focused businesses
