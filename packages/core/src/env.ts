import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_PASSWORD_HASH: z.string().optional(),
  DEFAULT_TIMEZONE: z.string().default("Africa/Lagos"),
  GROQ_API_KEY: z.string().optional(),
  GROQ_FAST_MODEL: z.string().default("openai/gpt-oss-20b"),
  GROQ_QUALITY_MODEL: z.string().default("openai/gpt-oss-120b"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_FAST_MODEL: z.string().optional(),
  OPENAI_QUALITY_MODEL: z.string().optional(),
  X_CLIENT_ID: z.string().optional(),
  X_CLIENT_SECRET: z.string().optional(),
  X_REDIRECT_URI: z.string().optional(),
  X_BEARER_TOKEN: z.string().optional(),
  X_OWNER_USER_ID: z.string().optional(),
  TOKEN_ENCRYPTION_KEY: z.string().min(16),
  DEFAULT_POST_SLOT_HOURS: z.string().default("12:30,16:30,20:30,23:00"),
  ENABLE_EXPERIMENTAL_SLOT: z.coerce.boolean().default(true),
  CRON_SHARED_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().optional()
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }

  return cachedEnv;
}
