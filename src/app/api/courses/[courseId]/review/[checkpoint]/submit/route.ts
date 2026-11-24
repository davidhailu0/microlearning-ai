import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getCheckpointReview, recordCheckpointReview } from "@/lib/repo";

const bodySchema = z.object({
  score: z.number().int().min(0),
  total: z.number().int().min(1),
});

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ courseId: string; checkpoint: string }> },
) {
  const { courseId, checkpoint } = await context.params;
  const checkpointIndex = Number(checkpoint);
  if (!Number.isInteger(checkpointIndex) || checkpointIndex < 1) {
    return NextResponse.json({ error: "Invalid checkpoint." }, { status: 400 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success || parsed.data.score > parsed.data.total) {
    return NextResponse.json({ error: "Invalid score." }, { status: 400 });
  }

  const user = await getCurrentUser();
  const review = await getCheckpointReview(courseId, checkpointIndex, user.id);
  if (!review) return NextResponse.json({ error: "Checkpoint not found." }, { status: 404 });
  if (review.locked) return NextResponse.json({ error: "Checkpoint is locked." }, { status: 403 });
  if (parsed.data.total !== review.questions.length) {
    return NextResponse.json({ error: "Question count changed. Reload the review." }, { status: 409 });
  }

  await recordCheckpointReview(
    user.id,
    courseId,
    checkpointIndex,
    parsed.data.score,
    parsed.data.total,
  );

  return NextResponse.json({ ok: true });
}
