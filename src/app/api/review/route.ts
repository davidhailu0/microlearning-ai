import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getDueCards, gradeCard } from "@/lib/repo";

const gradeSchema = z.object({
  flashcardId: z.string().uuid(),
  rating: z.enum(["hard", "good", "easy"]),
});

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  const cards = await getDueCards(user.id);
  return NextResponse.json({ cards });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = gradeSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review." }, { status: 400 });
  }

  const result = await gradeCard(user.id, parsed.data.flashcardId, parsed.data.rating);
  return NextResponse.json(result);
}
