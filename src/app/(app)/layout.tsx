import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getShellData } from "@/lib/repo";
import { TopBar } from "@/components/layout/top-bar";
import { SiteFooter } from "@/components/layout/site-footer";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const shell = await getShellData(user.id);

  return (
    <div className="flex min-h-svh flex-col">
      <TopBar
        name={shell.user.name}
        avatarUrl={shell.user.avatarUrl}
        xp={shell.user.xp}
        level={shell.user.level}
        streak={shell.streak.current}
        dueCount={shell.dueCount}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
