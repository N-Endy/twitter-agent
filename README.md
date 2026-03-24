# Twitter Agent MVP

Internal single-account X/Twitter agent for AI-assisted content drafting, approval, scheduling, mention monitoring, reply drafting, analytics, and safety.

## Workspace layout

- `apps/web`: Next.js admin dashboard and authenticated internal API routes.
- `apps/worker`: BullMQ worker process for pipeline jobs.
- `packages/core`: shared schemas, prompts, moderation rules, queue names, and service helpers.
- `prisma`: database schema and seed data.

## Local setup

1. Copy `.env.example` to `.env` and fill in secrets.
2. Start local services with `docker compose up -d`.
3. Install dependencies with `npm install`.
4. Generate Prisma client with `npm run prisma:generate`.
5. Push the schema with `npm run prisma:push`.
6. Seed demo data with `npm run seed`.
7. Run the apps:
   - `npm run dev:web`
   - `npm run dev:worker`

## Notes

- Replies are never fully autonomous in this MVP. The system drafts suggestions, but a human must explicitly send them.
- X inputs are restricted to curated post URLs or allowlisted accounts. Open-ended keyword hunting is intentionally excluded.
- The OpenAI integration is built around the Responses API and strict schema validation.
