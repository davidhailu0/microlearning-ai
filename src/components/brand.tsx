import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[0.7rem] bg-foreground text-background shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
        <path
          d="M12 2.4c.6 5.05 3.55 8 8.6 8.6-5.05.6-8 3.55-8.6 8.6-.6-5.05-3.55-8-8.6-8.6 5.05-.6 8-3.55 8.6-8.6Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5 outline-none", className)}
      aria-label="Lumen home"
    >
      <BrandMark className="transition-transform duration-300 group-hover:rotate-[10deg]" />
      <span className="text-[17px] font-semibold tracking-tight">Lumen</span>
    </Link>
  );
}
