import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { getLessonScript, setLessonAudio } from "@/lib/repo";

/**
 * Turns a lesson into a short podcast. In production the MP3 goes to Supabase
 * Storage; locally it is written to /public/audio so the player works offline.
 *
 * This is the one OpenAI-only path in the app: OpenRouter exposes chat
 * completions, not `/audio/speech`, so narration always needs OPENAI_API_KEY.
 */
export async function synthesizeLessonAudio(lessonId: string) {
  if (!env.ttsEnabled) {
    await setLessonAudio({
      lessonId,
      url: null,
      status: "failed",
      error: "OPENAI_API_KEY is not configured (OpenRouter cannot generate narration).",
    });
    return;
  }

  await setLessonAudio({ lessonId, url: null, status: "generating" });

  try {
    const { script } = await getLessonScript(lessonId);
    if (script.length < 40) throw new Error("Lesson script is too short to narrate.");

    const client = new OpenAI({ apiKey: env.openaiKey });
    const speech = await client.audio.speech.create({
      model: env.ttsModel,
      voice: env.ttsVoice,
      input: script,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await speech.arrayBuffer());

    if (env.supabaseUrl && env.supabaseServiceKey) {
      const supabase = createClient(env.supabaseUrl, env.supabaseServiceKey);
      const storagePath = `lessons/${lessonId}.mp3`;
      const { error } = await supabase.storage
        .from(env.audioBucket)
        .upload(storagePath, buffer, { contentType: "audio/mpeg", upsert: true });

      if (error) throw new Error(`Audio upload failed: ${error.message}`);

      const { data } = supabase.storage.from(env.audioBucket).getPublicUrl(storagePath);

      await setLessonAudio({
        lessonId,
        url: data.publicUrl,
        storagePath,
        status: "ready",
      });
      return;
    }

    const dir = path.join(process.cwd(), "public", "audio");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${lessonId}.mp3`), buffer);

    await setLessonAudio({
      lessonId,
      url: `/audio/${lessonId}.mp3`,
      storagePath: `public/audio/${lessonId}.mp3`,
      status: "ready",
    });
  } catch (error) {
    await setLessonAudio({
      lessonId,
      url: null,
      status: "failed",
      error: error instanceof Error ? error.message : "Audio generation failed.",
    });
    throw error;
  }
}
