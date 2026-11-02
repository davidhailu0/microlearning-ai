"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flame, Zap, LayoutDashboard, Layers, ChevronDown, Moon, Sun, Library } from "lucide-react";
import { useTheme } from "next-themes";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { initials, xpForNextLevel } from "@/lib/text";

type TopBarProps = {
  name: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  streak: number;
  dueCount: number;
};

const NAV = [
  { href: "/", label: "Learn", icon: LayoutDashboard },
  { href: "/courses", label: "My courses", icon: Library },
  { href: "/review", label: "Review", icon: Layers },
];

const subscribe = () => () => {};

/** False during SSR/hydration, true once the client owns the tree. */
function useMounted() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function TopBar({ name, avatarUrl, xp, level, streak, dueCount }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const nextLevelXp = xpForNextLevel(xp);
  const levelStart = Math.pow(level - 1, 2) * 120;
  const levelPercent = Math.min(
    100,
    Math.max(2, Math.round(((xp - levelStart) / Math.max(1, nextLevelXp - levelStart)) * 100)),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Brand />

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground",
                  active && "bg-muted text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
                {item.href === "/review" && dueCount > 0 && (
                  <span className="ml-0.5 rounded-full bg-foreground px-1.5 py-px text-[11px] font-semibold text-background tabular-nums">
                    {dueCount > 99 ? "99+" : dueCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/review"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 text-sm font-medium shadow-xs transition-colors hover:bg-muted/60"
            title={`${streak} day streak`}
          >
            <Flame className="size-4 text-orange-500" />
            <span className="tabular-nums">{streak}</span>
            <span className="sr-only">day streak</span>
          </Link>

          <span className="hidden h-9 items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 text-sm font-medium shadow-xs sm:inline-flex">
            <Zap className="size-4 text-amber-500" />
            <span className="tabular-nums">{xp.toLocaleString()}</span>
            <span className="text-muted-foreground">XP</span>
          </span>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="ml-0.5 flex items-center gap-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Account menu"
              >
                <Avatar className="size-9 border border-border/60">
                  {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
                  <AvatarFallback className="bg-foreground text-[11px] font-semibold text-background">
                    {initials(name)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="flex flex-col gap-1 py-2">
                <span className="text-sm font-semibold text-foreground">{name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {xp.toLocaleString()} XP · Level {level}
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={levelPercent} className="h-1.5" />
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {Math.max(0, nextLevelXp - xp).toLocaleString()} to go
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push("/")}>
                <LayoutDashboard className="size-4" />
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/courses")}>
                <Library className="size-4" />
                My courses
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/review")}>
                <Layers className="size-4" />
                Review queue
                {dueCount > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                    {dueCount}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setTheme(resolvedTheme === "dark" ? "light" : "dark");
                }}
              >
                {mounted && resolvedTheme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
                {mounted && resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
