export type CoverTint = {
  tile: string;
  hover: string;
  text: string;
};

/**
 * Course covers use a small, fixed palette rather than arbitrary colours so the
 * library stays coherent in both themes. Keep the class strings literal so
 * Tailwind can see them at build time.
 */
const TINTS: Record<string, CoverTint> = {
  amber: {
    tile: "bg-gradient-to-br from-amber-100 via-orange-50 to-white dark:from-amber-500/25 dark:via-orange-500/10 dark:to-transparent",
    hover: "group-hover:border-amber-300/70 dark:group-hover:border-amber-500/40",
    text: "text-amber-700 dark:text-amber-300",
  },
  emerald: {
    tile: "bg-gradient-to-br from-emerald-100 via-teal-50 to-white dark:from-emerald-500/25 dark:via-teal-500/10 dark:to-transparent",
    hover: "group-hover:border-emerald-300/70 dark:group-hover:border-emerald-500/40",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  sky: {
    tile: "bg-gradient-to-br from-sky-100 via-cyan-50 to-white dark:from-sky-500/25 dark:via-cyan-500/10 dark:to-transparent",
    hover: "group-hover:border-sky-300/70 dark:group-hover:border-sky-500/40",
    text: "text-sky-700 dark:text-sky-300",
  },
  violet: {
    tile: "bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white dark:from-violet-500/25 dark:via-fuchsia-500/10 dark:to-transparent",
    hover: "group-hover:border-violet-300/70 dark:group-hover:border-violet-500/40",
    text: "text-violet-700 dark:text-violet-300",
  },
  rose: {
    tile: "bg-gradient-to-br from-rose-100 via-pink-50 to-white dark:from-rose-500/25 dark:via-pink-500/10 dark:to-transparent",
    hover: "group-hover:border-rose-300/70 dark:group-hover:border-rose-500/40",
    text: "text-rose-700 dark:text-rose-300",
  },
  cyan: {
    tile: "bg-gradient-to-br from-cyan-100 via-sky-50 to-white dark:from-cyan-500/25 dark:via-sky-500/10 dark:to-transparent",
    hover: "group-hover:border-cyan-300/70 dark:group-hover:border-cyan-500/40",
    text: "text-cyan-700 dark:text-cyan-300",
  },
};

export function coverTint(color: string): CoverTint {
  return TINTS[color] ?? TINTS.amber;
}

export const LEVEL_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
