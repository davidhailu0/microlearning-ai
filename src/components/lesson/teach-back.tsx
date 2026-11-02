"use client";

import * as React from "react";
import { Check, Eye, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * Retrieval practice for whole-book lessons. Writing an explanation before
 * seeing the answer is the cheapest way to find out whether the lesson was
 * understood or merely recognised. The draft stays on the device.
 */
export function TeachBack({
  lessonId,
  bullets,
  takeaway,
}: {
  lessonId: string;
  bullets: string[];
  takeaway: string;
}) {
  const storageKey = `lumen.teachback.${lessonId}`;
  const [answer, setAnswer] = React.useState("");
  const [revealed, setRevealed] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    // Defer the read so the server-rendered empty state hydrates first.
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          setAnswer(stored);
          setSaved(true);
        }
      } catch {
        /* storage is optional */
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  function update(value: string) {
    setAnswer(value);
    setSaved(false);
    try {
      if (value.trim()) window.localStorage.setItem(storageKey, value);
      else window.localStorage.removeItem(storageKey);
      setSaved(true);
    } catch {
      /* storage is optional */
    }
  }

  function reset() {
    setRevealed(false);
    update("");
  }

  const words = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <section className="mt-10 rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-foreground text-background">
          <Eye className="size-3.5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Teach it back</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Close the lesson in your head and explain the idea in your own words. Then
            compare with the key points. If you cannot explain it, you have not learned it
            yet — reopen the source section and come back.
          </p>
        </div>
      </div>

      <Textarea
        value={answer}
        onChange={(event) => update(event.target.value)}
        placeholder="The author's claim is… It matters because… The evidence is…"
        rows={4}
        className="mt-3 min-h-24 resize-y bg-background text-[13px] leading-relaxed"
        aria-label="Explain this lesson in your own words"
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={revealed ? "outline" : "default"}
          disabled={words < 12}
          onClick={() => setRevealed((value) => !value)}
          className="h-8 gap-1.5 text-xs"
        >
          {revealed ? (
            <>
              <RotateCcw className="size-3.5" />
              Hide key points
            </>
          ) : (
            <>
              <Check className="size-3.5" />
              Compare with the key points
            </>
          )}
        </Button>

        <span className="text-[11px] text-muted-foreground">
          {words > 0 ? `${words} words` : "Write at least 12 words to check"}
          {saved && answer.trim() ? " · saved on this device" : ""}
        </span>

        {answer.trim() && (
          <button
            type="button"
            onClick={reset}
            className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {revealed && (
        <div className="mt-4 rounded-lg border border-border/70 bg-background p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            The lesson&apos;s key points
          </p>
          <ul className="mt-2 space-y-1.5">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2 text-[13px] leading-relaxed">
                <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/60" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-border/60 pt-3 text-[13px] font-medium leading-relaxed">
            {takeaway}
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            If your explanation missed one of these, reopen the cited section and reread
            that passage before moving on.
          </p>
        </div>
      )}
    </section>
  );
}
