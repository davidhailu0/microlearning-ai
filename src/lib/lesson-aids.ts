import type { Block } from "./types";

type LessonStep = { title: string; detail: string };

/**
 * The strongest worked example is usually a step that asks the learner to test,
 * measure, trace, or compare something. Prefer those, then steps with concrete
 * numbers, and otherwise use the final step in the sequence.
 */
function scoreStep(step: LessonStep, index: number) {
  let score = index / 100;
  if (/^(test|try|measure|compare|trace|run|simulate|profile|benchmark|fuzz|verify|check|inspect|replay|experiment)\b/i.test(step.title)) {
    score += 6;
  }
  if (/\b\d+(?:\.\d+)?\b/.test(step.detail)) score += 3;
  if (/(for example|e\.g\.|suppose|imagine|consider|such as)/i.test(step.detail)) score += 4;
  return score;
}

export function buildExampleBlock(steps: LessonStep[] | undefined): Block | null {
  if (!steps?.length) return null;

  const chosen = steps
    .map((step, index) => ({ step, score: scoreStep(step, index) }))
    .sort((a, b) => b.score - a.score)[0]?.step;

  if (!chosen) return null;
  return { type: "example", title: chosen.title, text: chosen.detail };
}

function clip(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Builds a compact process visual from the lesson's own steps. It is used only
 * when a lesson has no authored diagram, so existing diagrams stay intact.
 */
export function buildDiagramBlock(title: string, steps: LessonStep[] | undefined): Block | null {
  if (!steps || steps.length < 2) return null;

  const picked =
    steps.length <= 4 ? steps : [steps[0], steps[1], steps[2], steps[steps.length - 1]];
  const nodes = picked.map((step, index) => ({
    id: `step-${index + 1}`,
    label: clip(step.title, 34),
    emphasis: index === 0 || index === picked.length - 1,
  }));

  return {
    type: "diagram",
    diagram: {
      type: "process",
      title: clip(`How ${title} works`, 72),
      nodes,
      edges: nodes.slice(1).map((node, index) => ({
        from: nodes[index].id,
        to: node.id,
        label: "",
      })),
    },
  };
}
