import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { enqueueCourseGeneration, runJobSafely } from "@/lib/jobs";

const bodySchema = z
  .object({
    kind: z.enum(["prompt", "text", "url"]),
    sourceKind: z.enum(["pdf", "epub"]).optional(),
    prompt: z.string().trim().max(2000).optional(),
    text: z.string().trim().max(2_000_000).optional(),
    url: z.string().url().max(2000).optional(),
    title: z.string().trim().max(200).optional(),
    lessonCount: z.number().int().min(3).max(24).optional(),
    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.kind === "prompt" && !value.prompt) {
      ctx.addIssue({ code: "custom", message: "Describe what you want to learn." });
    }
    if (value.kind === "text" && !value.text) {
      ctx.addIssue({ code: "custom", message: "Paste some text first." });
    }
    if (value.kind === "url" && !value.url) {
      ctx.addIssue({ code: "custom", message: "Add a link first." });
    }
  });

export const runtime = "nodejs";
export const maxDuration = 600;

export async function POST(request: Request) {
  const user = await getCurrentUser();

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const jobId = await enqueueCourseGeneration(input, user.id);

  if (env.inlineJobs) {
    // Next's `after` keeps the response fast while the generation continues.
    const { after } = await import("next/server");
    after(async () => {
      await runJobSafely(jobId);
    });
  }

  return NextResponse.json({ jobId }, { status: 202 });
}
