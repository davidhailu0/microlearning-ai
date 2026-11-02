import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { completeLesson } from "@/lib/repo";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  context: { params: Promise<{ lessonId: string }> },
) {
  const user = await getCurrentUser();
  const { lessonId } = await context.params;

  try {
    const result = await completeLesson(user.id, lessonId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }
}
