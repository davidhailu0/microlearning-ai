import {
  createEmptyCard,
  fsrs,
  Rating,
  State,
  type Card,
  type Grade as FsrsGrade,
} from "ts-fsrs";

export type Grade = "hard" | "good" | "easy";

export const scheduler = fsrs({
  request_retention: 0.9,
  enable_fuzz: true,
});

export const ratingFor: Record<Grade, FsrsGrade> = {
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

const STATE_TO_ENUM: Record<string, State> = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
};

const ENUM_TO_STATE: Record<number, "new" | "learning" | "review" | "relearning"> = {
  [State.New]: "new",
  [State.Learning]: "learning",
  [State.Review]: "review",
  [State.Relearning]: "relearning",
};

export type StoredCardState = {
  due: Date | string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: string;
  lastReview: Date | string | null;
};

export function toFsrsCard(state: StoredCardState): Card {
  return {
    due: new Date(state.due),
    stability: state.stability,
    difficulty: state.difficulty,
    elapsed_days: state.elapsedDays,
    scheduled_days: state.scheduledDays,
    learning_steps: state.learningSteps,
    reps: state.reps,
    lapses: state.lapses,
    state: STATE_TO_ENUM[state.state] ?? State.New,
    last_review: state.lastReview ? new Date(state.lastReview) : undefined,
  };
}

export function fromFsrsCard(card: Card) {
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: ENUM_TO_STATE[card.state] ?? "new",
    lastReview: card.last_review ?? null,
  };
}

export function emptyCard(now = new Date()) {
  return { ...fromFsrsCard(createEmptyCard(now)), retrievability: 0 };
}

export function previewIntervals(state: StoredCardState, now = new Date()) {
  const card = toFsrsCard(state);
  const preview = scheduler.repeat(card, now);

  return {
    hard: formatInterval(preview[Rating.Hard].card.due, now),
    good: formatInterval(preview[Rating.Good].card.due, now),
    easy: formatInterval(preview[Rating.Easy].card.due, now),
  };
}

export function gradeStoredCard(
  state: StoredCardState,
  grade: Grade,
  now = new Date(),
) {
  const card = toFsrsCard(state);
  const result = scheduler.next(card, now, ratingFor[grade]);
  const retrievability = scheduler.get_retrievability(card, now, false);

  return {
    ...fromFsrsCard(result.card),
    retrievability,
    review: result.log,
  };
}

export function formatInterval(due: Date, now = new Date()) {
  const ms = due.getTime() - now.getTime();
  const minutes = Math.round(ms / 60_000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.round(months / 12)}y`;
}
