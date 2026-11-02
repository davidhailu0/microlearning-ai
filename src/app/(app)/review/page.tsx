import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getDueCards } from "@/lib/repo";
import { ReviewDeck } from "@/components/review/review-deck";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Review",
  description: "Spaced repetition queue.",
};

export default async function ReviewPage() {
  const user = await getCurrentUser();
  const cards = await getDueCards(user.id);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Today
      </Link>

      <header className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Layers className="size-5 text-muted-foreground" />
            Review
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {cards.length > 0
              ? `${cards.length} card${cards.length === 1 ? "" : "s"} due. Recall first, then grade honestly.`
              : "Nothing is due right now. Your schedule is doing its job."}
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground">
          <kbd className="rounded border border-border px-1 py-0.5 font-sans">space</kbd> reveal ·{" "}
          <kbd className="rounded border border-border px-1 py-0.5 font-sans">1</kbd>{" "}
          <kbd className="rounded border border-border px-1 py-0.5 font-sans">2</kbd>{" "}
          <kbd className="rounded border border-border px-1 py-0.5 font-sans">3</kbd> grade
        </p>
      </header>

      <div className="mt-8">
        <ReviewDeck cards={cards} />
      </div>
    </div>
  );
}
