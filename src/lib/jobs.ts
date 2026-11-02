import { env } from "./env";
import { generateBookDraft, generateCourseDraft, isBookSource } from "./ai/generate";
import { synthesizeLessonAudio } from "./ai/tts";
import { ingestPlainText, ingestUrl } from "./ingest";
import {
  createJob,
  failJob,
  getJobPayload,
  persistCourseDraft,
  updateJob,
} from "./repo";
import type { GenerateInput } from "./types";

export async function enqueueCourseGeneration(input: GenerateInput, userId: string) {
  return createJob("course_generation", {
    kind: "course_generation",
    input,
    userId,
  });
}

export async function enqueueAudio(lessonId: string, userId: string, courseId?: string) {
  return createJob("tts", { kind: "tts", lessonId, userId, courseId });
}

export async function processJob(jobId: string) {
  const payload = await getJobPayload(jobId);
  if (!payload) throw new Error("Job payload missing");

  if (payload.kind === "tts") {
    await updateJob(jobId, { status: "running", stage: "Recording audio", progress: 20 });
    await synthesizeLessonAudio(String(payload.lessonId));
    await updateJob(jobId, { status: "succeeded", stage: "Audio ready", progress: 100 });
    return;
  }

  const input = payload.input as GenerateInput;
  const userId = String(payload.userId);

  await updateJob(jobId, { status: "running", stage: "Reading the source", progress: 8 });

  const source =
    input.kind === "url" && input.url
      ? await ingestUrl(input.url)
      : input.kind === "text" && input.text
        ? ingestPlainText(input.text, input.title)
        : null;

  await updateJob(jobId, { status: "running", stage: "Finding the through-line", progress: 30 });

  const sourceKind = input.sourceKind ?? source?.kind ?? input.kind;

  if (source && isBookSource({ kind: sourceKind, wordCount: source.wordCount })) {
    const { draft, coverage } = await generateBookDraft({
      input,
      sourceText: source.text,
      kind: sourceKind,
      title: source.title ?? input.title ?? "Untitled book",
      author: source.author,
      wordCount: source.wordCount,
      pageCount: source.pageCount,
      onProgress: ({ stage, progress }) => {
        void updateJob(jobId, {
          status: "running",
          stage,
          progress: Math.max(10, Math.min(95, progress)),
        }).catch(() => undefined);
      },
    });

    await updateJob(jobId, {
      status: "running",
      stage: "Saving the course",
      progress: 96,
    });

    const { courseId, lessonIds } = await persistCourseDraft({
      draft,
      userId,
      sourceKind,
      sourceTitle: source.title ?? input.title ?? input.prompt,
      sourceAuthor: source.author,
      sourceUrl: input.url,
      wordCount: source.wordCount,
      charCount: source.text.length,
      metadata: coverage,
    });

    await updateJob(jobId, {
      status: "succeeded",
      stage: `Ready — ${lessonIds.length} lessons across ${coverage.sections} sections`,
      progress: 100,
      courseId,
      result: { courseId },
      error: null,
    });

    if (env.inlineJobs && env.ttsEnabled) {
      for (const lessonId of lessonIds.slice(0, 4)) {
        void synthesizeLessonAudio(lessonId).catch(() => undefined);
      }
    }
    return;
  }

  const { draft } = await generateCourseDraft({
    input,
    sourceText: source?.text,
    title: source?.title ?? input.title,
    author: source?.author,
    wordCount: source?.wordCount,
  });

  await updateJob(jobId, { status: "running", stage: "Writing the lessons", progress: 68 });

  const { courseId, lessonIds } = await persistCourseDraft({
    draft,
    userId,
    sourceKind,
    sourceTitle: source?.title ?? input.title ?? input.prompt,
    sourceAuthor: source?.author,
    sourceUrl: input.url,
    wordCount: source?.wordCount,
    charCount: source?.text.length,
  });

  await updateJob(jobId, {
    status: "succeeded",
    stage: `Ready — ${lessonIds.length} lessons`,
    progress: 100,
    courseId,
    result: { courseId },
    error: null,
  });

  // In inline/local mode there is no separate worker to pick up audio, so start
  // it in the background without blocking the course from opening.
  if (env.inlineJobs && env.ttsEnabled) {
    for (const lessonId of lessonIds.slice(0, 4)) {
      void synthesizeLessonAudio(lessonId).catch(() => undefined);
    }
  }
}

export async function runJobSafely(jobId: string) {
  try {
    await processJob(jobId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Job failed";
    await failJob(jobId, message);
  }
}
