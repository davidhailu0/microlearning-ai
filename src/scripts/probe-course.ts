import "dotenv/config";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from "../lib/env";
import { getAiClient } from "../lib/ai/client";
import { buildUserPrompt, SYSTEM_PROMPT } from "../lib/ai/prompts";
import { courseDraftSchema } from "../lib/ai/schema";
import { generateCourseDraft } from "../lib/ai/generate";

/**
 * Diagnostic probe for course generation. Run with:
 *   FREELLMAPI_MODEL=<model> OPENAI_MAX_TOKENS=<n> npx tsx src/scripts/probe-course.ts [--raw]
 *
 * --raw runs only the first schema-first attempt and dumps raw JSON,
 * finish reason, and the first schema issue so failures can be inspected.
 * Default mode calls generateCourseDraft (the real ladder) end to end.
 */
async function raw() {
  // Same prompt the app builds for a short-source course.
  // Mirrors generateCourseDraft: the tight instruction kicks in below 5000.
  const tight =
    env.maxOutputTokens < 5000
      ? "\n\nThe output budget is tight: use exactly 3 modules with 2 lessons each, and one paragraph per lesson."
      : "";

  const messages = [
    {
      role: "system" as const,
      content: `${SYSTEM_PROMPT}\n\nReturn exactly one JSON object matching the course schema. No prose, no markdown fences.${tight}`,
    },
    {
      role: "user" as const,
      content: buildUserPrompt({
      input: {
        kind: "prompt",
        prompt: "Photosynthesis: how plants turn light into chemical energy",
        level: "beginner",
        lessonCount: 9,
      },
      sourceText: `Photosynthesis is the process by which green plants, algae, and some
bacteria convert light energy into chemical energy stored in glucose. It takes place
primarily in the chloroplasts of plant cells, using the pigment chlorophyll to absorb
light, mostly in the blue and red portions of the spectrum. The overall reaction uses
carbon dioxide and water to produce glucose and oxygen, but it unfolds in two linked
stages. The light-dependent reactions occur in the thylakoid membranes, where
photons excite electrons in photosystem II and photosystem I, driving the splitting of
water (photolysis) and the production of ATP and NADPH via an electron transport chain
and chemiosmosis. The light-independent reactions, or Calvin cycle, occur in the
stroma: the enzyme RuBisCO fixes CO2 onto ribulose bisphosphate, producing
3-phosphoglycerate, which is reduced to glyceraldehyde-3-phosphate using ATP and
NADPH, some of which exits as sugar while the rest regenerates the CO2 acceptor.
Factors limiting the rate include light intensity, carbon dioxide concentration, and
temperature, each with a characteristic saturation curve. Photorespiration, in which
RuBisCO fixes oxygen instead of carbon dioxide, wastes energy and is partly suppressed
in C4 and CAM plants that spatially or temporally separate initial carbon fixation from
the Calvin cycle. Evolutionarily, oxygenic photosynthesis oxygenated the Earth's
atmosphere roughly 2.4 billion years ago, enabling aerobic life.`,
      }),
    },
  ];

  const started = Date.now();
  try {
    const completion = await getAiClient().chat.completions.create({
      model: env.model,
      temperature: 0.6,
      max_tokens: env.maxOutputTokens,
      messages,
      response_format: zodResponseFormat(courseDraftSchema, "course"),
    });

    const seconds = ((Date.now() - started) / 1000).toFixed(1);
    const choice = completion.choices[0];
    const content = choice?.message?.content?.trim() ?? "";
    console.log(`\n${seconds}s via ${completion.model}`);
    console.log(`finish: ${choice?.finish_reason ?? "(none)"}`);
    console.log(
      `usage:  in ${completion.usage?.prompt_tokens ?? "?"} / out ${completion.usage?.completion_tokens ?? "?"}`,
    );
    console.log(`chars:  ${content.length}`);

    if (!content) {
      console.log(`EMPTY: refusal=${choice?.message?.refusal ?? "(none)"}`);
      return;
    }

    const json = JSON.parse(
      content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""),
    ) as unknown;
    const parsed = courseDraftSchema.safeParse(json);
    if (parsed.success) {
      const lessons = parsed.data.modules.reduce(
        (sum, mod) => sum + mod.lessons.length,
        0,
      );
      console.log(
        `VALID: ${parsed.data.modules.length} modules / ${lessons} lessons — "${parsed.data.title}"`,
      );
      return;
    }
    for (const issue of parsed.error.issues.slice(0, 12)) {
      console.log(
        `INVALID: ${issue.path.join(".") || "root"}: ${issue.message ?? "schema mismatch"}`,
      );
    }
    console.log(`(${parsed.error.issues.length} issues total)`);
    const obj = json as { modules?: Record<string, unknown>[] };
    console.log(
      `mod keys: ${obj.modules?.map((mod) => Object.keys(mod).join(",")).join(" | ")}`,
    );
    console.log(`head: ${content.slice(0, 200)}`);
    console.log(`tail: ${content.slice(-300)}`);
  } catch (error) {
    const seconds = ((Date.now() - started) / 1000).toFixed(1);
    console.error(`\nFAILED after ${seconds}s: ${error instanceof Error ? error.message : error}`);
  }
}

async function full() {
  const started = Date.now();
  const result = await generateCourseDraft({
    input: {
      kind: "prompt",
      prompt: "Photosynthesis: how plants turn light into chemical energy",
      level: "beginner",
      lessonCount: 9,
    },
    sourceText: `Photosynthesis is the process by which green plants, algae, and some
bacteria convert light energy into chemical energy stored in glucose. It takes place
primarily in the chloroplasts of plant cells, using the pigment chlorophyll to absorb
light. The overall reaction uses carbon dioxide and water to produce glucose and
oxygen, but it unfolds in two linked stages. The light-dependent reactions occur in the
thylakoid membranes, where photons excite electrons, driving the splitting of water and
the production of ATP and NADPH via an electron transport chain. The light-independent
reactions, the Calvin cycle, occur in the stroma: RuBisCO fixes CO2 onto ribulose
bisphosphate, producing 3-phosphoglycerate, which is reduced to
glyceraldehyde-3-phosphate using ATP and NADPH. Factors limiting the rate include light
intensity, carbon dioxide concentration, and temperature. Photorespiration wastes
energy and is partly suppressed in C4 and CAM plants. Oxygenic photosynthesis
oxygenated the Earth's atmosphere roughly 2.4 billion years ago, enabling aerobic life.`,
  });

  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  const { draft, tokens } = result;
  console.log(`\nDone in ${seconds}s (in ${tokens.input} / out ${tokens.output} tokens)`);
  console.log(`Title:  ${draft.title}`);
  console.log(`Desc:   ${draft.description}`);
  const lessons = draft.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
  console.log(`Shape:  ${draft.modules.length} modules / ${lessons} lessons`);
  for (const mod of draft.modules) {
    console.log(`  - ${mod.title} (${mod.lessons.length} lessons)`);
  }
}

async function main() {
  console.log(`Provider:  ${env.aiProviderLabel}`);
  console.log(`Base URL:  ${env.aiBaseUrl}`);
  console.log(`Model:     ${env.model}`);
  console.log(`MaxTokens: ${env.maxOutputTokens}`);

  if (process.argv.includes("--raw")) await raw();
  else await full();
}

main().catch((error: unknown) => {
  console.error(`FAILED: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
