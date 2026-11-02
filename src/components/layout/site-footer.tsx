import Link from "next/link";
import { BrandMark } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <BrandMark className="size-7 rounded-[0.55rem]" />
          <p className="text-xs text-muted-foreground">
            Lumen · learn anything in three-minute lessons
          </p>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Today
          </Link>
          <Link href="/review" className="transition-colors hover:text-foreground">
            Review
          </Link>
          <span className="tabular-nums">FSRS v5</span>
        </div>
      </div>
    </footer>
  );
}
