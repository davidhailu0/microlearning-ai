/**
 * Centralised runtime configuration. Nothing here throws at import time so
 * `next build` works in a fresh checkout without secrets.
 */

function bool(value: string | undefined, fallback = false) {
  if (value == null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

type AiProvider = "openai" | "openrouter" | "freellmapi" | "none";

const openaiKey = process.env.OPENAI_API_KEY ?? "";
const openrouterKey = process.env.OPENROUTER_API_KEY ?? "";
const freellmapiKey = process.env.FREELLMAPI_API_KEY ?? "";
const freellmapiBaseUrl =
  process.env.FREELLMAPI_BASE_URL?.trim() || "http://localhost:3001/v1";

/**
 * An explicit `AI_PROVIDER` wins when its key is present; otherwise we use
 * whichever key is configured. This keeps a half-migrated `.env.local` working
 * instead of silently dropping to the local generator.
 */
function pickProvider(): AiProvider {
  const requested = (process.env.AI_PROVIDER ?? "auto").toLowerCase();

  if (requested === "freellmapi" && freellmapiKey) return "freellmapi";
  if (requested === "openrouter" && openrouterKey) return "openrouter";
  if (requested === "openai" && openaiKey) return "openai";
  if (openaiKey) return "openai";
  if (openrouterKey) return "openrouter";
  if (freellmapiKey) return "freellmapi";
  return "none";
}

const aiProvider = pickProvider();

const explicitBaseUrl =
  process.env.OPENAI_BASE_URL?.trim() || process.env.AI_BASE_URL?.trim() || "";

export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  get dbEnabled() {
    return this.databaseUrl.length > 0;
  },

  openaiKey,
  openrouterKey,
  freellmapiKey,
  freellmapiBaseUrl,
  aiProvider,
  /** Chat generation and the tutor work with any of the providers. */
  get aiEnabled() {
    return aiProvider !== "none";
  },
  /** Credential for the active chat provider. */
  aiKey:
    aiProvider === "freellmapi"
      ? freellmapiKey
      : aiProvider === "openrouter"
        ? openrouterKey
        : openaiKey,
  /** Empty means the OpenAI SDK default; remote providers set their own endpoint. */
  aiBaseUrl:
    explicitBaseUrl ||
    (aiProvider === "freellmapi"
      ? freellmapiBaseUrl
      : aiProvider === "openrouter"
        ? "https://openrouter.ai/api/v1"
        : ""),
  get aiProviderLabel() {
    if (aiProvider === "freellmapi") return "FreeLLMAPI";
    if (aiProvider === "openrouter") return "OpenRouter";
    if (aiProvider === "openai") return "OpenAI";
    return "local generator";
  },

  /** OpenRouter routes by vendor-prefixed slug, e.g. `openai/gpt-4o-mini`. */
  model:
    aiProvider === "freellmapi"
      ? process.env.FREELLMAPI_MODEL ?? "auto"
      : process.env.OPENAI_MODEL ??
        (aiProvider === "openrouter" ? "openai/gpt-4o" : "gpt-4o"),
  tutorModel:
    aiProvider === "freellmapi"
      ? process.env.FREELLMAPI_TUTOR_MODEL ?? process.env.FREELLMAPI_MODEL ?? "auto"
      : process.env.OPENAI_TUTOR_MODEL ??
        (aiProvider === "openrouter" ? "openai/gpt-4o-mini" : "gpt-4o-mini"),
  /**
   * Free routers can be slow and already do their own upstream failover, so we
   * cap each request and let the app's format ladder handle retries.
   */
  freellmapiTimeoutMs: Number(process.env.FREELLMAPI_TIMEOUT_MS ?? 240_000),
  /** Completion budget for course generation. Lower it for constrained keys. */
  maxOutputTokens: Number(process.env.OPENAI_MAX_TOKENS ?? 8000),

  /** Narration is OpenAI-only: OpenRouter has no `/audio/speech` endpoint. */
  get ttsEnabled() {
    return openaiKey.length > 0;
  },
  ttsModel: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
  ttsVoice: process.env.OPENAI_TTS_VOICE ?? "alloy",

  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  audioBucket: process.env.SUPABASE_AUDIO_BUCKET ?? "course-audio",

  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  /** Jobs run in-process after the response unless you start the worker. */
  inlineJobs: bool(process.env.INLINE_JOBS, true),
  allowPrivateUrls: bool(process.env.ALLOW_PRIVATE_URLS, false),

  /** Bounds the token cost of a single generation. */
  maxSourceChars: Number(process.env.MAX_SOURCE_CHARS ?? 48_000),
  defaultLessonCount: Number(process.env.DEFAULT_LESSON_COUNT ?? 12),
  maxLessons: Number(process.env.MAX_LESSONS ?? 24),

  /**
   * Whole-book mode. Above this word count a PDF/EPUB (or a very long pasted
   * text) is generated section by section instead of from a sampled digest.
   */
  bookMinWords: Number(process.env.BOOK_MIN_WORDS ?? 7_000),
  /** Upper bound on multi-pass calls, to keep one job under the route budget. */
  bookMaxModules: Number(process.env.BOOK_MAX_MODULES ?? 14),
  /** Upper bound on generated lessons across the whole book. */
  bookMaxLessons: Number(process.env.BOOK_MAX_LESSONS ?? 60),
  /** Parallel section-batch calls. Lower it for strict rate limits. */
  bookConcurrency: Number(process.env.BOOK_CONCURRENCY ?? 3),
};

export const demoUserId = process.env.DEMO_USER_ID ?? "00000000-0000-4000-8000-000000000001";

export function isDemoMode() {
  return !env.dbEnabled;
}
