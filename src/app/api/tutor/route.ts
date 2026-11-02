import { NextResponse } from "next/server";
import { z } from "zod";
import { getAiClient, resolveModel } from "@/lib/ai/client";
import { getCurrentUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { getLesson } from "@/lib/repo";

const bodySchema = z.object({
  lessonId: z.string().uuid(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(12),
});

export const runtime = "nodejs";

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
    return NextResponse.json({ error: "Invalid tutor request." }, { status: 400 });
  }

  const { lessonId, messages } = parsed.data;
  const lesson = await getLesson(lessonId, user.id);
  if (!lesson) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });

  if (!env.aiEnabled) {
    const last = messages.at(-1)?.content ?? "";
    return NextResponse.json({
      reply: `Here's the short version from this lesson: ${lesson.takeaway}\n\nYou asked: "${last}". In the full version I'd connect that to ${
        lesson.objective || lesson.title
      }. Add OPENAI_API_KEY, OPENROUTER_API_KEY, or FREELLMAPI_API_KEY to get a live tutor that can go deeper.`,
      demo: true,
    });
  }

  const context = [
    `Course: ${lesson.courseTitle}`,
    `Lesson: ${lesson.title}`,
    `Objective: ${lesson.objective}`,
    `Key takeaway: ${lesson.takeaway}`,
    "Lesson content:",
    ...lesson.blocks.map((block) => JSON.stringify(block)),
  ]
    .join("\n")
    .slice(0, 12_000);

  const client = getAiClient();
  const completion = await client.chat.completions.create({
    model: resolveModel(env.tutorModel),
    temperature: 0.4,
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: `You are the tutor inside a micro-learning lesson. Stay grounded in the lesson context. Be concise: 2 short paragraphs or a short list. Use a concrete example when it helps. If the question is outside the lesson, say so and offer the nearest useful idea from the lesson. Never invent facts, numbers, or citations.\n\n<lesson>\n${context}\n</lesson>`,
      },
      ...messages.map((message) => ({ role: message.role, content: message.content })),
    ],
  });

  return NextResponse.json({
    reply:
      completion.choices[0]?.message.content ??
      "I couldn't form an answer. Try asking in a different way.",
  });
}
