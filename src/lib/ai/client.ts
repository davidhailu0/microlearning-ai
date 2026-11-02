import OpenAI from "openai";
import { env } from "@/lib/env";

/**
 * Shared chat client. OpenRouter and FreeLLMAPI speak the OpenAI wire format,
 * so the same SDK works with a different base URL, key, and (for OpenRouter)
 * attribution headers.
 */
let client: OpenAI | null = null;

export function getAiClient() {
  if (!env.aiEnabled) {
    throw new Error(
      "No AI provider configured. Set OPENAI_API_KEY, OPENROUTER_API_KEY, or FREELLMAPI_API_KEY (or run in demo mode).",
    );
  }

  client ??= new OpenAI({
    apiKey: env.aiKey,
    ...(env.aiBaseUrl ? { baseURL: env.aiBaseUrl } : {}),
    ...(env.aiProvider === "freellmapi"
      ? { timeout: env.freellmapiTimeoutMs, maxRetries: 0 }
      : {}),
    ...(env.aiProvider === "openrouter"
      ? {
          defaultHeaders: {
            // OpenRouter uses these for attribution/analytics. Both optional.
            "HTTP-Referer": env.appUrl,
            "X-Title": "Lumen",
          },
        }
      : {}),
  });

  return client;
}

/**
 * OpenRouter routes by `vendor/model` slug. Bare names (`gpt-4o-mini`) are
 * treated as OpenAI models; fully-qualified slugs (`anthropic/...`) pass through.
 * FreeLLMAPI model ids (`auto`, `deepseek-v4-pro`) are passed through as-is.
 */
export function resolveModel(model: string) {
  if (env.aiProvider !== "openrouter") return model;
  return model.includes("/") ? model : `openai/${model}`;
}
