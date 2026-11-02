import "dotenv/config";
import OpenAI from "openai";
import { env } from "../lib/env";

/**
 * Smoke-tests the configured chat provider over the same wire protocol the app
 * uses. Run with `npm run check:ai`.
 */
async function main() {
  console.log(`Provider: ${env.aiProviderLabel}`);
  console.log(`Base URL: ${env.aiBaseUrl || "(SDK default)"}`);
  console.log(`Model:    ${env.model}`);

  if (!env.aiEnabled) {
    console.error(
      "No AI provider configured. Set FREELLMAPI_API_KEY, OPENAI_API_KEY, or OPENROUTER_API_KEY.",
    );
    process.exitCode = 1;
    return;
  }

  const client = new OpenAI({
    apiKey: env.aiKey,
    ...(env.aiBaseUrl ? { baseURL: env.aiBaseUrl } : {}),
    ...(env.aiProvider === "freellmapi"
      ? { timeout: env.freellmapiTimeoutMs, maxRetries: 0 }
      : {}),
  });

  const modelsStarted = Date.now();
  const models = await client.models.list();
  console.log(
    `Models:   ${models.data.length} visible in ${Date.now() - modelsStarted}ms`,
  );

  if (env.model !== "auto" && !models.data.some((model) => model.id === env.model)) {
    console.log(
      `Warning:  ${env.model} is not listed by /v1/models; the router may still accept it.`,
    );
  }

  const chatStarted = Date.now();
  const completion = await client.chat.completions.create({
    model: env.model,
    temperature: 0.2,
    max_tokens: 200,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Return one JSON object only, with no markdown." },
      { role: "user", content: 'Return {"ok": true, "provider": "FreeLLMAPI"}.' },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? "";
  const parsed = JSON.parse(content) as { ok?: boolean };

  console.log(`Chat:     ${Date.now() - chatStarted}ms via ${completion.model}`);
  console.log(`JSON:     ${parsed.ok === true ? "ok" : "unexpected"} (${content.slice(0, 120)})`);

  if (parsed.ok !== true) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
