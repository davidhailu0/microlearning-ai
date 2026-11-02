import { emptyCard, gradeStoredCard, previewIntervals, type Grade } from "@/lib/fsrs";
import { demoUserId } from "@/lib/env";
import { levelForXp } from "@/lib/text";
import type { CourseDraft, LessonDraft } from "@/lib/ai/schema";
import type {
  ActiveCourse,
  Block,
  CourseDetail,
  CourseSummary,
  DashboardData,
  DueCard,
  JobView,
  LessonDetail,
  QuizView,
  UserCourse,
} from "@/lib/types";

/* ------------------------------------------------------------------- types */

type DemoQuiz = {
  id: string;
  question: string;
  options: { id: string; label: string; isCorrect: boolean }[];
  explanation: string;
  passScore: number;
  points: number;
};

type DemoCard = { id: string; front: string; back: string; concept: string };

type DemoLessonRecord = {
  id: string;
  courseId: string;
  moduleId: string;
  position: number;
  title: string;
  objective: string;
  hook: string;
  summary: string;
  takeaway: string;
  estimatedMinutes: number;
  xpReward: number;
  blocks: Block[];
  quiz: DemoQuiz | null;
  cards: DemoCard[];
  sourceRef: LessonDetail["sourceRef"];
  audioUrl: string | null;
  audioStatus: "none" | "queued" | "generating" | "ready" | "failed";
};

type DemoModuleRecord = {
  id: string;
  courseId: string;
  position: number;
  title: string;
  summary: string;
};

type DemoCourseRecord = {
  summary: CourseSummary;
  sourceTitle: string | null;
  sourceAuthor: string | null;
  sourceUrl: string | null;
  coverage: CourseDetail["coverage"];
  createdAt: string;
  modules: DemoModuleRecord[];
  lessons: DemoLessonRecord[];
  completed: Set<string>;
  currentLessonId: string | null;
};

type DemoJob = JobView & { payload: Record<string, unknown> };

type DemoState = {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    xp: number;
    timezone: string;
  };
  streak: { current: number; longest: number; lastActiveDate: string | null };
  courses: Map<string, DemoCourseRecord>;
  cards: Map<string, { flashcardId: string; front: string; back: string; concept: string; courseId: string; lessonId: string | null }>;
  cardStates: Map<string, ReturnType<typeof emptyCard>>;
  jobs: Map<string, DemoJob>;
  stats: { lessonsThisWeek: number; minutesThisWeek: number; reviewsToday: number };
};

const g = globalThis as unknown as { __lumenDemo?: DemoState };

function state(): DemoState {
  g.__lumenDemo ??= seed();
  return g.__lumenDemo;
}

/* -------------------------------------------------------------------- seed */

function lesson(
  overrides: Partial<LessonDraft> & Pick<LessonDraft, "title" | "objective">,
  index: number,
): LessonDraft {
  return {
    hook: `${overrides.title} is easier to see once you know what to look for.`,
    paragraphs: [
      "The useful version of this idea is smaller than it looks. Hold one clear model in your head, then hang the details on it.",
      "When you change one part of a system, the change travels. The result can feel like resistance, but it is usually structure doing its job.",
    ],
    bullets: [
      "A model is a tool for prediction, not a complete description.",
      "Feedback turns a single action into a pattern over time.",
      "Structural changes beat heroic effort.",
    ],
    takeaway: "Name the loop and the delay, and most of the behaviour becomes predictable.",
    diagram:
      index === 1
        ? {
            type: "cycle",
            title: "The feedback loop",
            nodes: [
              { id: "a", label: "Action", emphasis: false },
              { id: "b", label: "Result", emphasis: false },
              { id: "c", label: "Adjustment", emphasis: true },
            ],
            edges: [
              { from: "a", to: "b", label: "produces" },
              { from: "b", to: "c", label: "triggers" },
              { from: "c", to: "a", label: "changes" },
            ],
          }
        : null,
    quiz: {
      question: `Which statement best captures ${overrides.title.toLowerCase()}?`,
      options: [
        "It is a fixed set of facts to memorise.",
        "It is a structure whose feedback explains its behaviour.",
        "It only works when nothing else changes.",
        "It is best understood by studying each part alone.",
      ],
      correctIndex: 1,
      explanation:
        "The point of the model is the relationship between parts. Isolated facts don't predict behaviour; feedback does.",
    },
    flashcards: [
      {
        front: `What is the core idea behind ${overrides.title.toLowerCase()}?`,
        back: "Inputs move through a mechanism and return a result that changes the next input.",
      },
      {
        front: "What should you look for first when a system behaves unexpectedly?",
        back: "The loop and the delay — not a broken component.",
      },
    ],
    ...overrides,
  };
}

export function heroDraft(): CourseDraft {
  return {
    title: "Thinking in Systems",
    description:
      "A working model of why systems surprise us — stocks, feedback, delays, and the small places where change actually sticks.",
    category: "Systems thinking",
    level: "beginner",
    coverEmoji: "🌀",
    tags: ["mental models", "feedback", "decision-making"],
    modules: [
      {
        title: "Seeing the system",
        summary: "Stop explaining events by pointing at a culprit. Start seeing structure.",
        lessons: [
          lesson(
            {
              title: "Why systems surprise us",
              objective: "Explain why the same structure produces different outcomes over time.",
              hook: "We blame the event. The event is usually the last domino, not the cause.",
              paragraphs: [
                "When something goes wrong, the instinct is to find the person or moment responsible. Systems thinking asks a different question: what structure made that moment likely?",
                "A system is a set of parts that influence each other. Its behaviour comes from the relationships, not from any single part. That is why replacing a part rarely fixes the pattern.",
                "The surprise is the point. If you can explain why the behaviour was predictable, you have found the system.",
              ],
              bullets: [
                "Events are snapshots; structure is the generator of events.",
                "Blame is a poor guide to leverage.",
                "The same structure tends to reproduce the same outcome.",
              ],
              takeaway: "Look one level below the event: what arrangement keeps producing it?",
            },
            0,
          ),
          lesson(
            {
              title: "Stocks, flows, and the bathtub",
              objective: "Read any accumulating quantity as a stock with inflows and outflows.",
              hook: "A bathtub is the most honest model in economics.",
              paragraphs: [
                "A stock is anything that accumulates: water, money, trust, carbon, skill. A flow is the rate at which it enters or leaves.",
                "The level only changes when the flows differ. Inflow equals outflow, and the level holds steady even though everything is still moving.",
                "Most arguments about levels are really arguments about flows, and most shocks are felt through the delay between them.",
              ],
              bullets: [
                "Stocks buffer; flows drive.",
                "A steady level can hide a large turnover.",
                "You cannot fix a stock problem with a one-time flow.",
              ],
              takeaway: "Name the stock, then name what is filling and draining it.",
            },
            1,
          ),
          lesson(
            {
              title: "Everything is connected",
              objective: "Trace a change to its second- and third-order effects.",
              hook: "The first consequence is rarely the one that matters.",
              paragraphs: [
                "Systems are loops, not lists. Pull one lever and the effect travels, arriving somewhere else as a surprise.",
                "Second-order effects are not side effects. They are the system's response, and they often dominate the first-order win.",
                "The practical move is to ask: and then what? Three times.",
              ],
              bullets: [
                "Every intervention produces a response.",
                "The response is where the leverage or the trap lives.",
                "Ask 'and then what?' before committing.",
              ],
              takeaway: "The system always answers. Plan for the answer, not just the action.",
            },
            2,
          ),
        ],
      },
      {
        title: "Feedback",
        summary: "Loops, delays, and the reason good decisions oscillate.",
        lessons: [
          lesson(
            {
              title: "Reinforcing loops",
              objective: "Identify compounding loops and their runaway risk.",
              hook: "Success that feeds itself is either a flywheel or a fire.",
              paragraphs: [
                "A reinforcing loop returns its own output as more input. Growth, panic, reputation, and compound interest all share this shape.",
                "These loops look like straight lines for a while, then bend sharply. The bend is not a new force; it is the loop becoming visible.",
                "Every reinforcing loop eventually meets a limit. The interesting question is where that limit sits.",
              ],
              bullets: [
                "Reinforcing loops amplify whatever they carry.",
                "Exponential curves are loops seen late.",
                "Find the limit before celebrating the curve.",
              ],
              takeaway: "Ask what would have to run out for this loop to stop.",
            },
            3,
          ),
          lesson(
            {
              title: "Balancing loops",
              objective: "Explain how systems resist change and stay near a target.",
              hook: "The thermostat is not stubborn. It is doing exactly what it was built to do.",
              paragraphs: [
                "A balancing loop compares the current state with a goal and acts to close the gap. It is the source of stability and the source of resistance.",
                "Push a balancing system and it pushes back. That is not failure; it is the loop defending its target.",
                "If you want a different level, change the goal or the feedback — not the effort.",
              ],
              bullets: [
                "Stability is an active achievement, not an absence of change.",
                "Resistance is information about the target.",
                "Changing the target beats pushing harder.",
              ],
              takeaway: "When a system keeps returning to the same place, find its goal.",
            },
            4,
          ),
          lesson(
            {
              title: "Delays make us oscillate",
              objective: "Predict overshoot when feedback lags.",
              hook: "The shower problem explains most bad policy.",
              paragraphs: [
                "When the signal arrives late, you keep acting on information that is already stale. You overshoot, then overcorrect.",
                "Oscillation is not a sign that someone is foolish. It is what a well-intentioned actor does inside a delay.",
                "The fix is usually slower action, shorter feedback, or a buffer — not more force.",
              ],
              bullets: [
                "Delay converts a good decision into a bad pattern.",
                "Overshoot is structural, not personal.",
                "Shorten the loop or dampen the response.",
              ],
              takeaway: "Before turning the dial again, check how old your information is.",
            },
            5,
          ),
        ],
      },
      {
        title: "Leverage",
        summary: "Where small changes actually change the system.",
        lessons: [
          lesson(
            {
              title: "Where leverage hides",
              objective: "Find interventions that change structure rather than symptoms.",
              hook: "The obvious lever is usually the weakest one.",
              paragraphs: [
                "Leverage is not effort. It is fit between an intervention and the structure producing the behaviour.",
                "Parameters are easy to change and rarely matter. Rules, goals, and information flows change what the system does.",
                "The highest leverage is usually a different question, not a bigger push.",
              ],
              bullets: [
                "Symptoms are downstream of structure.",
                "Rules and information flows outrank effort.",
                "Small, well-placed changes can move a lot.",
              ],
              takeaway: "Change the rule, not the volume.",
            },
            6,
          ),
          lesson(
            {
              title: "Rules, goals, and paradigms",
              objective: "Rank interventions by the depth of structure they touch.",
              hook: "A budget is a belief with a number attached.",
              paragraphs: [
                "Rules decide who gets what and what counts as success. Goals decide which loops run. Paradigms decide what questions are askable.",
                "Moving one level deeper usually makes the shallower fight irrelevant.",
                "This is also why deep interventions attract resistance: they threaten the system's identity, not just its outputs.",
              ],
              bullets: [
                "Parameters < rules < goals < paradigms.",
                "Deeper leverage is slower and more contested.",
                "Name the level you are actually changing.",
              ],
              takeaway: "Ask which layer your intervention touches — and whether you can go one deeper.",
            },
            7,
          ),
          lesson(
            {
              title: "Designing for resilience",
              objective: "Build systems that can absorb surprise without collapsing.",
              hook: "Efficiency optimises for the world you expected.",
              paragraphs: [
                "Resilience is the capacity to absorb disturbance and keep functioning. It comes from diversity, redundancy, and slack.",
                "Those look like waste right up until the moment they are the only thing working.",
                "The design question is not 'how do we prevent every shock?' but 'what can we lose without losing the system?'",
              ],
              bullets: [
                "Slack is a feature, not a failure.",
                "Diversity buys insurance against prediction error.",
                "Design for the loss you can survive.",
              ],
              takeaway: "Keep one buffer you never optimise away.",
            },
            8,
          ),
        ],
      },
    ],
  };
}

export type CuratedEntry = {
  title: string;
  prompt: string;
  emoji: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  modules: { title: string; summary: string; lessons: string[] }[];
};

export const CURATED: CuratedEntry[] = [
  {
    title: "The Psychology of Habit",
    prompt: "how habits form and how to change them",
    emoji: "🔁",
    category: "Behavioral science",
    level: "beginner",
    description:
      "Habits are not willpower. They are cues, routines, and rewards — and once you can see the loop, you can edit it.",
    modules: [
      {
        title: "The loop",
        summary: "How a habit is actually built, and why intention is a small part of it.",
        lessons: ["Your brain is a prediction machine", "Cue, routine, reward"],
      },
      {
        title: "Why change fails",
        summary: "The friction that keeps you stuck, and where to push instead.",
        lessons: ["Willpower is the wrong lever", "The environment votes first"],
      },
      {
        title: "Editing a loop",
        summary: "Small changes that survive a bad week.",
        lessons: ["Make it obvious, make it easy", "Recover faster than you quit"],
      },
    ],
  },
  {
    title: "How LLMs Actually Work",
    prompt: "how large language models work, intuitively",
    emoji: "🧠",
    category: "AI",
    level: "intermediate",
    description:
      "No maths required. A working model of tokens, attention, and why a language model can seem to reason.",
    modules: [
      {
        title: "The machine",
        summary: "What is actually happening when you type a prompt.",
        lessons: ["Tokens, not words", "Prediction, one token at a time"],
      },
      {
        title: "Attention",
        summary: "Why context changes what a word means.",
        lessons: ["The problem with fixed meaning", "Attention as a weighted lookup"],
      },
      {
        title: "Limits",
        summary: "What the model cannot do, and why it sounds confident anyway.",
        lessons: ["Why it hallucinates", "Context windows and forgetting"],
      },
    ],
  },
  {
    title: "Design for Attention",
    prompt: "designing products for attention without exploiting people",
    emoji: "👁️",
    category: "Design",
    level: "intermediate",
    description:
      "Attention is scarce and easily taken. A short course on designing for it without treating people as inventory.",
    modules: [
      {
        title: "The scarce resource",
        summary: "Why attention behaves like a budget rather than a switch.",
        lessons: ["Attention has a budget", "Friction is a design material"],
      },
      {
        title: "Patterns that take",
        summary: "The mechanics of compulsion, and who pays for it.",
        lessons: ["The pull of the variable reward", "Dark patterns send the bill"],
      },
      {
        title: "Patterns that give",
        summary: "Design that leaves the user better off than it found them.",
        lessons: ["Designing for intention", "Measure what you would defend"],
      },
    ],
  },
  {
    title: "A Short History of Money",
    prompt: "a short history of money and credit",
    emoji: "🪙",
    category: "History",
    level: "beginner",
    description:
      "From tally sticks to central banks: money is a technology for remembering who owes whom.",
    modules: [
      {
        title: "Before coins",
        summary: "Credit is older than currency, and stranger.",
        lessons: ["Debt came first", "Tally sticks and trust"],
      },
      {
        title: "Coins and banks",
        summary: "How metal became a system, and how banks joined in.",
        lessons: ["Why metal won", "Banks create deposits"],
      },
      {
        title: "Fiat and after",
        summary: "What changed when money stopped being a promise of metal.",
        lessons: ["Leaving the gold standard", "What money is now"],
      },
    ],
  },
  {
    title: "Networks That Shape Us",
    prompt: "how networks shape behaviour and ideas",
    emoji: "🕸️",
    category: "Sociology",
    level: "beginner",
    description:
      "Your friends' friends change what you know, earn, and believe. An introduction to how networks actually work.",
    modules: [
      {
        title: "Structure",
        summary: "A network is a shape, and the shape decides what flows.",
        lessons: ["Six degrees is a claim about shape", "Hubs and the long tail"],
      },
      {
        title: "Contagion",
        summary: "How behaviour and beliefs travel between people.",
        lessons: ["How behaviour spreads", "Weak ties carry new information"],
      },
      {
        title: "Design",
        summary: "Why some networks trap you, and how to build bridges.",
        lessons: ["Why some networks trap you", "Building bridges on purpose"],
      },
    ],
  },
  {
    title: "Probability Without Formulas",
    prompt: "probability intuition without formulas",
    emoji: "🎲",
    category: "Math",
    level: "beginner",
    description:
      "Most probability mistakes are framing mistakes. Learn to see base rates, sample spaces, and luck clearly.",
    modules: [
      {
        title: "Counting honestly",
        summary: "Get the sample space right and most puzzles dissolve.",
        lessons: ["The sample space does the work", "Coincidence is cheap"],
      },
      {
        title: "Updating",
        summary: "How to change your mind by the right amount.",
        lessons: ["Base rates before stories", "Bayes in one sentence"],
      },
      {
        title: "Risk",
        summary: "Expected value is a tool, not a prophecy.",
        lessons: ["Expected value is not a prediction", "Rare events and ruin"],
      },
    ],
  },
];

function blocksFromDraft(draft: LessonDraft): Block[] {
  const blocks: Block[] = [{ type: "hook", text: draft.hook }];
  for (const paragraph of draft.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
  blocks.push({ type: "bullets", items: draft.bullets });
  if (draft.diagram) blocks.push({ type: "diagram", diagram: draft.diagram });
  blocks.push({ type: "takeaway", text: draft.takeaway });
  return blocks;
}

export function addDemoCourse(
  draft: CourseDraft,
  meta: {
    sourceKind: string;
    sourceTitle?: string;
    sourceAuthor?: string;
    sourceUrl?: string;
    metadata?: Record<string, unknown>;
  },
): string {
  const store = state();
  const courseId = crypto.randomUUID();
  const summary: CourseSummary = {
    id: courseId,
    title: draft.title,
    description: draft.description,
    category: draft.category || "General",
    level: draft.level,
    coverEmoji: draft.coverEmoji || "📘",
    coverColor: "amber",
    estimatedMinutes: draft.modules.reduce(
      (sum, module) =>
        sum +
        module.lessons.reduce(
          (lessonSum, lesson) => lessonSum + (lesson.estimatedMinutes ?? 3),
          0,
        ),
      0,
    ),
    lessonCount: draft.modules.reduce((sum, module) => sum + module.lessons.length, 0),
    isCurated: false,
    sourceKind: meta.sourceKind,
    tags: draft.tags,
  };

  const modules: DemoModuleRecord[] = draft.modules.map((module, moduleIndex) => ({
    id: crypto.randomUUID(),
    courseId,
    position: moduleIndex,
    title: module.title,
    summary: module.summary,
  }));

  let position = 0;
  const lessons: DemoLessonRecord[] = [];
  for (const [moduleIndex, module] of draft.modules.entries()) {
    for (const item of module.lessons) {
      const id = crypto.randomUUID();
      const quizId = crypto.randomUUID();
      const cards: DemoCard[] = item.flashcards.map((card) => ({
        id: crypto.randomUUID(),
        front: card.front,
        back: card.back,
        concept: item.title,
      }));

      lessons.push({
        id,
        courseId,
        moduleId: modules[moduleIndex].id,
        position: position++,
        title: item.title,
        objective: item.objective,
        hook: item.hook,
        summary: item.takeaway,
        takeaway: item.takeaway,
        estimatedMinutes: item.estimatedMinutes ?? 3,
        xpReward: 20,
        blocks: blocksFromDraft(item),
        quiz: {
          id: quizId,
          question: item.quiz.question,
          options: item.quiz.options.map((label, index) => ({
            id: crypto.randomUUID(),
            label,
            isCorrect: index === item.quiz.correctIndex,
          })),
          explanation: item.quiz.explanation,
          passScore: 60,
          points: 10,
        },
        cards,
        sourceRef: item.sourceRef ?? null,
        audioUrl: null,
        audioStatus: "none" as const,
      });

      for (const card of cards) {
        store.cards.set(card.id, {
          flashcardId: card.id,
          front: card.front,
          back: card.back,
          concept: card.concept,
          courseId,
          lessonId: id,
        });
      }
    }
  }

  const metaRecord = meta.metadata as
    | { bookMode?: boolean; sections?: number; words?: number; throughline?: string }
    | undefined;

  store.courses.set(courseId, {
    summary,
    sourceTitle: meta.sourceTitle ?? null,
    sourceAuthor: meta.sourceAuthor ?? null,
    sourceUrl: meta.sourceUrl ?? null,
    coverage:
      metaRecord?.bookMode && metaRecord.sections
        ? {
            sections: metaRecord.sections,
            words: metaRecord.words ?? 0,
            throughline: metaRecord.throughline ?? null,
          }
        : null,
    createdAt: new Date().toISOString(),
    modules,
    lessons,
    completed: new Set(),
    currentLessonId: lessons[0]?.id ?? null,
  });

  return courseId;
}

/**
 * Cards are authored with the course but only enter the review schedule once
 * the learner finishes the lesson. Otherwise a freshly generated course would
 * dump dozens of unseen cards into today's queue.
 */
export function ensureDemoCardStates(lessonId: string) {
  const store = state();
  const course = [...store.courses.values()].find((item) =>
    item.lessons.some((lesson) => lesson.id === lessonId),
  );
  if (!course) return;

  const lesson = course.lessons.find((item) => item.id === lessonId);
  if (!lesson) return;

  const now = new Date();
  for (const card of lesson.cards) {
    if (store.cardStates.has(card.id)) continue;
    store.cardStates.set(card.id, emptyCard(now));
  }
}

function seed(): DemoState {
  const store: DemoState = {
    user: {
      id: demoUserId,
      name: "Alex Rivera",
      email: "alex@example.com",
      avatarUrl: null,
      xp: 2480,
      timezone: "UTC",
    },
    streak: { current: 7, longest: 21, lastActiveDate: null },
    courses: new Map(),
    cards: new Map(),
    cardStates: new Map(),
    jobs: new Map(),
    stats: { lessonsThisWeek: 6, minutesThisWeek: 41, reviewsToday: 12 },
  };

  g.__lumenDemo = store;

  const heroId = addDemoCourse(heroDraft(), {
    sourceKind: "curated",
    sourceTitle: "Thinking in Systems",
    sourceAuthor: "Lumen Library",
  });
  const hero = store.courses.get(heroId)!;
  hero.summary.isCurated = true;
  hero.completed = new Set([hero.lessons[0].id, hero.lessons[1].id]);
  hero.currentLessonId = hero.lessons[2].id;

  for (const [index, curated] of CURATED.entries()) {
    const draft = curatedDraft(curated);
    const id = addDemoCourse(draft, { sourceKind: "curated", sourceTitle: curated.title });
    const record = store.courses.get(id)!;
    record.summary.isCurated = true;
    record.summary.coverColor = ["emerald", "sky", "violet", "rose", "cyan", "amber"][index % 6];
  }

  // Only completed lessons enter the review schedule.
  for (const lessonId of hero.completed) ensureDemoCardStates(lessonId);

  const heroCards = hero.lessons
    .filter((lesson) => hero.completed.has(lesson.id))
    .flatMap((lesson) => lesson.cards);

  heroCards.slice(0, 4).forEach((card, index) => {
    const current = store.cardStates.get(card.id);
    if (!current) return;
    store.cardStates.set(card.id, {
      ...current,
      due: new Date(Date.now() - (index + 1) * 3_600_000),
    });
  });

  return store;
}

export function curatedDraft(entry: CuratedEntry): CourseDraft {
  let index = 0;

  const modules = entry.modules.map((module) => ({
    title: module.title,
    summary: module.summary,
    lessons: module.lessons.map((lessonTitle) =>
      lesson(
        {
          title: lessonTitle,
          objective: `Explain ${lessonTitle.toLowerCase()} in plain language, and name where the idea breaks down.`,
          hook: `Most explanations of ${lessonTitle.toLowerCase()} start with vocabulary. Start with the mechanism instead.`,
          paragraphs: [
            `${lessonTitle} is easier to see once you know what to look for. Hold one mechanism in mind — what causes what, in which order — and the details have somewhere to attach.`,
            `This sits inside a larger argument about ${entry.prompt}. The useful version is small: a claim you can test against your own experience, rather than a list to memorise.`,
            `So the skill is not recall. It is noticing the moment the idea applies, and the moment it stops applying.`,
          ],
          bullets: [
            "Start with the mechanism, not the vocabulary.",
            "Look for the feedback before blaming a part.",
            "Prefer a small test over a large opinion.",
          ],
          takeaway: `You do not need the whole field — you need one model of ${entry.prompt.toLowerCase()} you can use tomorrow.`,
        },
        index++,
      ),
    ),
  }));

  return {
    title: entry.title,
    description: entry.description,
    category: entry.category,
    level: entry.level,
    coverEmoji: entry.emoji,
    tags: [entry.category.toLowerCase(), "curated"],
    modules,
  };
}

/* ---------------------------------------------------------------- reading */

function summaryOf(course: DemoCourseRecord): CourseSummary {
  return {
    ...course.summary,
    lessonCount: course.lessons.length,
    estimatedMinutes: course.lessons.reduce(
      (sum, lesson) => sum + lesson.estimatedMinutes,
      0,
    ),
  };
}

function percentOf(course: DemoCourseRecord) {
  if (!course.lessons.length) return 0;
  return Math.round((course.completed.size / course.lessons.length) * 100);
}

export function demoUserCourses(limit = 50): UserCourse[] {
  return [...state().courses.values()]
    .filter((course) => !course.summary.isCurated)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map((course) => ({
      ...summaryOf(course),
      percent: percentOf(course),
      completedLessons: course.completed.size,
      currentLessonId: course.currentLessonId,
      createdAt: course.createdAt,
      lastActivityAt: null,
      sourceTitle: course.sourceTitle,
    }));
}

export function demoDashboard(): DashboardData {
  const store = state();
  const now = Date.now();
  const dueCount = [...store.cardStates.values()].filter(
    (card) => new Date(card.due).getTime() <= now,
  ).length;

  const active: ActiveCourse[] = [...store.courses.values()]
    .filter((course) => course.completed.size > 0 && course.completed.size < course.lessons.length)
    .map((course) => {
      const current = course.lessons.find((lesson) => lesson.id === course.currentLessonId);
      return {
        ...summaryOf(course),
        percent: percentOf(course),
        completedLessons: course.completed.size,
        currentLessonId: course.currentLessonId,
        currentLessonTitle: current?.title ?? null,
        lastActivityAt: new Date(now - 2 * 3_600_000).toISOString(),
      };
    });

  const curated = [...store.courses.values()]
    .filter((course) => course.summary.isCurated)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6)
    .map(summaryOf);

  return {
    user: {
      id: store.user.id,
      name: store.user.name,
      avatarUrl: store.user.avatarUrl,
      xp: store.user.xp,
      level: levelForXp(store.user.xp),
    },
    streak: {
      current: store.streak.current,
      longest: store.streak.longest,
      friendStreak: 3,
    },
    dueCount,
    active,
    history: demoUserCourses(6),
    curated,
    stats: store.stats,
  };
}

export function demoCourse(courseId: string): CourseDetail | null {
  const record = state().courses.get(courseId);
  if (!record) return null;

  return {
    ...summaryOf(record),
    percent: percentOf(record),
    completedLessons: record.completed.size,
    nextLessonId:
      record.lessons.find((lesson) => !record.completed.has(lesson.id))?.id ?? null,
    coverage: record.coverage,
    modules: record.modules.map((module) => ({
      id: module.id,
      title: module.title,
      summary: module.summary,
      lessons: record.lessons
        .filter((lesson) => lesson.moduleId === module.id)
        .map((lesson) => ({
          id: lesson.id,
          position: lesson.position,
          title: lesson.title,
          objective: lesson.objective,
          estimatedMinutes: lesson.estimatedMinutes,
          completed: record.completed.has(lesson.id),
        })),
    })),
  };
}

function quizView(quiz: DemoQuiz): QuizView {
  return {
    id: quiz.id,
    question: quiz.question,
    options: quiz.options.map(({ id, label }) => ({ id, label })),
    passScore: quiz.passScore,
    points: quiz.points,
  };
}

export function demoLesson(lessonId: string): LessonDetail | null {
  const store = state();
  for (const course of store.courses.values()) {
    const index = course.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) continue;
    const record = course.lessons[index];
    const moduleRecord = course.modules.find((item) => item.id === record.moduleId);

    return {
      id: record.id,
      courseId: course.summary.id,
      courseTitle: course.summary.title,
      moduleTitle: moduleRecord?.title ?? "",
      position: record.position,
      totalLessons: course.lessons.length,
      title: record.title,
      objective: record.objective,
      takeaway: record.takeaway,
      estimatedMinutes: record.estimatedMinutes,
      xpReward: record.xpReward,
      blocks: record.blocks,
      audioUrl: record.audioUrl,
      audioStatus: record.audioStatus,
      quiz: record.quiz ? quizView(record.quiz) : null,
      sourceRef: record.sourceRef,
      nextLessonId: course.lessons[index + 1]?.id ?? null,
      prevLessonId: course.lessons[index - 1]?.id ?? null,
      completed: course.completed.has(record.id),
    };
  }
  return null;
}

export function demoDueCards(limit = 30): DueCard[] {
  const store = state();
  const now = new Date();
  const due: DueCard[] = [];

  for (const [id, card] of store.cards) {
    const cardState = store.cardStates.get(id);
    if (!cardState) continue;
    if (new Date(cardState.due).getTime() > now.getTime()) continue;

    const course = store.courses.get(card.courseId);
    due.push({
      flashcardId: id,
      lessonId: card.lessonId,
      courseId: card.courseId,
      courseTitle: course?.summary.title ?? "Course",
      concept: card.concept,
      front: card.front,
      back: card.back,
      due: new Date(cardState.due).toISOString(),
      state: cardState.state,
      reps: cardState.reps,
      retrievability: cardState.retrievability,
      previews: previewIntervals(cardState, now),
    });
  }

  return due
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, limit);
}

export function demoGradeCard(flashcardId: string, grade: Grade) {
  const store = state();
  const current = store.cardStates.get(flashcardId);
  if (!current) throw new Error("Card not found");

  const now = new Date();
  const next = gradeStoredCard(current, grade, now);
  store.cardStates.set(flashcardId, {
    due: next.due,
    stability: next.stability,
    difficulty: next.difficulty,
    elapsedDays: next.elapsedDays,
    scheduledDays: next.scheduledDays,
    learningSteps: next.learningSteps,
    reps: next.reps,
    lapses: next.lapses,
    state: next.state,
    lastReview: next.lastReview,
    retrievability: next.retrievability,
  });

  store.user.xp += 8;
  store.stats.reviewsToday += 1;

  return {
    nextDue: next.due.toISOString(),
    interval: next.scheduledDays ? `${next.scheduledDays}d` : "soon",
    previews: previewIntervals(store.cardStates.get(flashcardId)!, now),
  };
}

export function demoSubmitQuiz(quizId: string, optionId: string) {
  for (const course of state().courses.values()) {
    for (const lesson of course.lessons) {
      if (lesson.quiz?.id !== quizId) continue;
      const correct = lesson.quiz.options.find((option) => option.isCorrect);
      const isCorrect = correct?.id === optionId;
      if (isCorrect) state().user.xp += lesson.quiz.points;
      return {
        correct: Boolean(isCorrect),
        correctOptionId: correct?.id ?? null,
        explanation: lesson.quiz.explanation,
        points: isCorrect ? lesson.quiz.points : 0,
      };
    }
  }
  throw new Error("Quiz not found");
}

export function demoCompleteLesson(lessonId: string) {
  const store = state();
  for (const course of store.courses.values()) {
    const index = course.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) continue;

    course.completed.add(lessonId);
    const next = course.lessons[index + 1] ?? null;
    course.currentLessonId = next?.id ?? null;
    store.user.xp += course.lessons[index].xpReward;
    ensureDemoCardStates(lessonId);

    return {
      nextLessonId: next?.id ?? null,
      percent: percentOf(course),
      courseId: course.summary.id,
    };
  }
  throw new Error("Lesson not found");
}

/* ------------------------------------------------------------------- jobs */

export function demoCreateJob(kind: "course_generation" | "tts", payload: Record<string, unknown>) {
  const id = crypto.randomUUID();
  state().jobs.set(id, {
    id,
    status: "queued",
    stage: kind === "course_generation" ? "Queued" : "Preparing audio",
    progress: 0,
    courseId: null,
    error: null,
    result: null,
    payload,
  });
  return id;
}

export function demoJob(id: string): JobView | null {
  const job = state().jobs.get(id);
  if (!job) return null;
  return {
    id: job.id,
    status: job.status,
    stage: job.stage,
    progress: job.progress,
    courseId: job.courseId,
    error: job.error,
    result: job.result,
  };
}

export function demoUpdateJob(id: string, patch: Partial<DemoJob>) {
  const job = state().jobs.get(id);
  if (!job) return;
  state().jobs.set(id, { ...job, ...patch });
}

export function demoJobPayload(id: string): Record<string, unknown> | null {
  return state().jobs.get(id)?.payload ?? null;
}
