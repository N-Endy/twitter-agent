# Twitter Agent MVP

Internal single-account X/Twitter agent for AI-assisted content drafting, approval, scheduling, mention monitoring, reply drafting, analytics, and safety.

## Workspace layout

- `apps/web`: Next.js admin dashboard and authenticated internal API routes.
- `apps/worker`: BullMQ worker process for pipeline jobs.
- `packages/core`: shared schemas, prompts, moderation rules, queue names, X/Groq clients, and system-state helpers.
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

## Production setup

### Infrastructure

- Web app: Railway service built from the repo root.
- Worker: separate Railway service built from the same repo root.
- Postgres: Neon.
- Redis: Railway Redis.
- Scheduler: `cron-job.org`.

### Required environment variables

- Runtime database:
  - `DATABASE_URL`: pooled Neon connection string for the app runtime.
  - `DIRECT_URL`: direct Neon connection string for Prisma CLI commands.
- Queue/runtime:
  - `REDIS_URL`
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
  - `TOKEN_ENCRYPTION_KEY`
  - `CRON_SHARED_SECRET`
- Admin auth:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`
- AI:
  - `GROQ_API_KEY`
  - `GROQ_FAST_MODEL`
  - `GROQ_QUALITY_MODEL`
- X:
  - `X_CLIENT_ID`
  - `X_CLIENT_SECRET`
  - `X_REDIRECT_URI`
  - `X_BEARER_TOKEN`
  - `X_OWNER_USER_ID` optional if OAuth connect captures it automatically

### Railway service commands

Use `/` as the root directory for both services.

Web service:

- Build command: `npm run build --workspace @twitter-agent/core && npm run build --workspace @twitter-agent/web`
- Start command: `npm run start --workspace @twitter-agent/web`

Worker service:

- Build command: `npm run build --workspace @twitter-agent/worker`
- Start command: `npm run start --workspace @twitter-agent/worker`

### Neon + Prisma

- Keep `DATABASE_URL` pointed at the pooled Neon host.
- Keep `DIRECT_URL` pointed at the direct Neon host.
- Prisma CLI commands in this repo now prefer `DIRECT_URL`, while the running app still uses `DATABASE_URL`.

Typical deploy-time commands:

```bash
npm run prisma:generate
npm run prisma:push
```

### X account connect flow

1. Create/configure an X app with OAuth 2.0 enabled.
2. Set the callback URL to:
   - local: `http://localhost:3000/api/auth/callback/x`
   - production: `https://YOUR_DOMAIN/api/auth/callback/x`
3. Add `X_CLIENT_ID`, `X_CLIENT_SECRET`, `X_REDIRECT_URI`, and `X_BEARER_TOKEN`.
4. Sign into the dashboard and use the X connect action so the app can store encrypted OAuth tokens.

## cron-job.org scheduler

This repo expects `cron-job.org` to call the internal cron endpoints on the web app with the shared secret header:

- Header name: `x-cron-secret`
- Header value: your `CRON_SHARED_SECRET`

Recommended jobs:

- `POST /api/cron/source-ingest`
- `POST /api/cron/weekly-batch`
- `POST /api/cron/mention-poll`
- `POST /api/cron/publish`
- `POST /api/cron/metrics-sync`
- `POST /api/cron/cleanup`

Suggested frequencies:

- `source-ingest`: every 6-12 hours
- `weekly-batch`: once weekly on Sunday evening
- `mention-poll`: every 5 minutes
- `publish`: every 5 minutes
- `metrics-sync`: hourly
- `cleanup`: hourly

## X billing / credit behavior

When X returns `402`, the app now treats that as a temporary billing block instead of a normal failure.

- `publish`, `mention-poll`, and `metrics-sync` stop retrying noisily and return a skipped result.
- `source-ingest` continues processing URL/RSS sources and skips only X-backed sources.
- manual reply send returns a friendly billing-required error instead of surfacing a raw X failure.
- the dashboard shows `Billing blocked` until a later successful X API call clears the state.

The billing block is stored in `system_state` and is automatically retried after the cooldown window expires.

## Notes

- Replies are never fully autonomous in this MVP. The system drafts suggestions, but a human must explicitly send them.
- X inputs are restricted to curated post URLs or allowlisted accounts. Open-ended keyword hunting is intentionally excluded.
- The Groq integration uses Groq's OpenAI-compatible API with strict JSON schema mode for typed outputs.
- Recommended defaults for this repo are `openai/gpt-oss-20b` for fast classification/drafting work and `openai/gpt-oss-120b` for higher-quality ideation/writing.
