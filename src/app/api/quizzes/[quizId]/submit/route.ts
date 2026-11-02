import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { submitQuiz } from "@/lib/repo";

const bodySchema = z.object({
  optionId: z.string().uuid(),
});

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ quizId: string }> },
) {
  const user = await getCurrentUser();
  const { quizId } = await context.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose an answer first." }, { status: 400 });
  }

  const result = await submitQuiz(user.id, quizId, parsed.data.optionId);
  return NextResponse.json(result);
}
