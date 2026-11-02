import { ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DiagramSpec } from "@/lib/types";

function nodeBox(emphasis: boolean) {
  return cn(
    "flex min-h-11 items-center justify-center rounded-lg border px-3 py-2 text-center text-[12px] font-medium leading-tight",
    emphasis
      ? "border-transparent bg-foreground text-background"
      : "border-border/70 bg-background text-foreground",
  );
}

function edgeLabel(spec: DiagramSpec, from: string, to: string) {
  const edge = spec.edges.find((item) => item.from === from && item.to === to);
  return edge?.label ?? "";
}

export function Diagram({ diagram }: { diagram: DiagramSpec }) {
  const { nodes, type, title } = diagram;

  return (
    <figure className="rounded-xl border border-border/70 bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Diagram
        </span>
        <span className="text-[11px] text-muted-foreground/70">·</span>
        <figcaption className="text-[11px] font-medium text-muted-foreground">
          {title}
        </figcaption>
      </div>

      {(type === "process" || type === "cycle") && (
        <div className="flex flex-wrap items-center gap-2">
          {nodes.map((node, index) => {
            const next = nodes[index + 1];
            return (
              <div key={node.id} className="flex items-center gap-2">
                <span className={nodeBox(node.emphasis)}>{node.label}</span>
                {next && (
                  <span className="flex flex-col items-center gap-0.5 px-0.5">
                    {edgeLabel(diagram, node.id, next.id) && (
                      <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
                        {edgeLabel(diagram, node.id, next.id)}
                      </span>
                    )}
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </span>
                )}
              </div>
            );
          })}
          {type === "cycle" && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
              <RotateCcw className="size-3" />
              loops back
            </span>
          )}
        </div>
      )}

      {type === "hierarchy" && (
        <div>
          <div className={cn(nodeBox(nodes[0]?.emphasis ?? false), "mx-auto w-fit")}>
            {nodes[0]?.label}
          </div>
          <div className="mt-3 grid gap-2 border-t border-dashed border-border/70 pt-3 sm:grid-cols-2">
            {nodes.slice(1).map((node) => (
              <span key={node.id} className={nodeBox(node.emphasis)}>
                {node.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {type === "compare" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1].map((column) => {
            const half = Math.ceil(nodes.length / 2);
            const group = column === 0 ? nodes.slice(0, half) : nodes.slice(half);
            return (
              <div
                key={column}
                className="rounded-lg border border-dashed border-border/70 bg-muted/25 p-2.5"
              >
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {column === 0 ? "This" : "That"}
                </p>
                <div className="space-y-1.5">
                  {group.map((node) => (
                    <span key={node.id} className={cn(nodeBox(node.emphasis), "w-full")}>
                      {node.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </figure>
  );
}
