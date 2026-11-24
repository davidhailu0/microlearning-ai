import { Check, Lightbulb, Quote, TriangleAlert, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Block } from "@/lib/types";
import { Diagram } from "./diagram";

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </div>
  );
}

function Paragraph({ text }: { text: string }) {
  return (
    <p className="max-w-[68ch] text-[16.5px] leading-[1.8] tracking-[-0.006em] text-foreground/85 text-pretty">
      {text}
    </p>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "hook":
      return (
        <p className="border-l-2 border-amber-400/70 pl-4 text-[19px] font-medium leading-relaxed tracking-tight text-foreground/90">
          {block.text}
        </p>
      );

    case "paragraph":
      return <Paragraph text={block.text} />;

    case "bullets":
      return (
        <ul className="space-y-2.5 rounded-xl border border-border/70 bg-card/60 p-4 sm:p-5">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-2.5 text-[14.5px] leading-[1.65]">
              <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="text-foreground/85">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <section className="rounded-xl border border-border/70 bg-card p-5">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Sparkles className="size-3.5" />
            {block.title ?? "Do it yourself"}
          </p>
          <ol className="mt-3 space-y-3">
            {block.items.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                  {index + 1}
                </span>
                <div>
                  <p className="text-[14px] font-medium leading-snug">{item.title}</p>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-foreground/75">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      );

    case "example":
      return (
        <aside className="relative overflow-hidden rounded-xl border border-amber-200/80 bg-amber-50/55 p-5 dark:border-amber-500/25 dark:bg-amber-500/10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-amber-300/25 blur-2xl dark:bg-amber-400/10"
          />
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-amber-200/70 text-amber-800 dark:bg-amber-400/20 dark:text-amber-200">
              <Lightbulb className="size-4" />
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800/80 dark:text-amber-200/80">
              Example
            </p>
          </div>
          <p className="mt-2 text-[14.5px] font-semibold leading-snug">{block.title}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-foreground/80 text-pretty">
            {block.text}
          </p>
          {block.points?.length ? (
            <ul className="mt-3 space-y-1.5">
              {block.points.map((point) => (
                <li key={point} className="flex gap-2 text-[13px] leading-relaxed text-foreground/75">
                  <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-amber-600/70" />
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      );

    case "takeaway":
      return (
        <aside className="relative overflow-hidden rounded-xl bg-primary p-5 text-primary-foreground">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-white/10 blur-2xl"
          />
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-70">
            <Lightbulb className="size-3.5" />
            Key takeaway
          </p>
          <p className="mt-2 text-[15.5px] font-medium leading-relaxed text-pretty">{block.text}</p>
        </aside>
      );

    case "callout": {
      const tone = block.tone ?? "info";
      const styles = {
        info: "border-sky-200 bg-sky-50/70 text-sky-950 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-100",
        warning:
          "border-amber-200 bg-amber-50/70 text-amber-950 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-100",
        success:
          "border-emerald-200 bg-emerald-50/70 text-emerald-950 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-100",
      }[tone];
      const Icon = tone === "warning" ? TriangleAlert : tone === "success" ? Sparkles : Info;

      return (
        <div className={cn("flex gap-2.5 rounded-xl border p-4", styles)}>
          <Icon className="mt-0.5 size-4 shrink-0 opacity-70" />
          <p className="text-[14px] leading-relaxed text-pretty">{block.text}</p>
        </div>
      );
    }

    case "quote":
      return (
        <blockquote className="rounded-xl border border-border/70 bg-muted/30 p-5">
          <Quote className="size-4 text-muted-foreground/60" />
          <p className="mt-2 text-[16px] italic leading-relaxed text-foreground/85 text-pretty">
            {block.text}
          </p>
          {block.attribution && (
            <footer className="mt-2 text-xs text-muted-foreground">
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      );

    case "diagram":
      return <Diagram diagram={block.diagram} />;

    case "stat":
      return (
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <p className="text-[32px] font-semibold leading-none tracking-tight tabular-nums">
            {block.value}
          </p>
          <p className="mt-1.5 text-[13px] text-muted-foreground">{block.label}</p>
          {block.source && (
            <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/70">
              {block.source}
            </p>
          )}
        </div>
      );

    case "definition":
      return (
        <dl className="rounded-xl border border-border/70 bg-card p-4">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {block.term}
          </dt>
          <dd className="mt-1.5 text-[15px] leading-relaxed text-foreground/85 text-pretty">
            {block.text}
          </dd>
        </dl>
      );

    case "comparison":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {[block.left, block.right].map((side, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/70 bg-card p-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {side.title}
              </p>
              <ul className="mt-2 space-y-1.5">
                {side.points.map((point, pointIndex) => (
                  <li
                    key={pointIndex}
                    className="flex gap-2 text-[14px] leading-relaxed text-foreground/85"
                  >
                    <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "image":
      return (
        <figure className="overflow-hidden rounded-xl border border-border/70 bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt={block.alt} className="w-full object-cover" />
          {block.caption && (
            <figcaption className="px-4 py-2.5 text-[11px] text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}
