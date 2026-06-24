# RFP Agent OS

Proof-of-concept web application demonstrating Genius Sports' AI-powered media RFP operating system.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Mock data + deterministic AI logic (no LLM, no database, no auth)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with summary cards and active RFP table |
| `/new` | New RFP intake form with mock AI extraction |
| `/rfps` | All RFP opportunities |
| `/rfps/[id]` | Solution Brief, workstreams, risks, proposal draft |
| `/settings` | POC configuration notes |

## Sample Data

Three seeded RFPs: Nike (Awaiting Inputs), FanDuel (Solution Brief Created), Toyota (Proposal Draft).

New RFPs created via intake are persisted in browser localStorage.

## Mock AI Logic

See `src/lib/ai-logic.ts` for deterministic functions:

- Field extraction from intake + free text
- Complexity classification
- Internal team routing
- Risk identification
- Proposal draft generation

Replace with LLM integration when ready.

## Brand Tokens

Design tokens from the Genius Sports `lovable-brand-template` are applied in `src/app/globals.css` and `src/lib/tokens.ts`.

## Future Integration Points

Comments throughout the codebase mark where to add:

- LLM extraction (Vercel AI SDK)
- Database (Supabase/Postgres)
- CRM (Salesforce)
- Notifications (Slack)
- Authentication
