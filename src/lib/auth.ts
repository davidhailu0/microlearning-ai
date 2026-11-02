import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { demoUserId, env } from "./env";

export type CurrentUser = {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
};

const fallback: CurrentUser = {
  id: demoUserId,
  name: "Alex Rivera",
  email: "alex@example.com",
  avatarUrl: null,
};

/**
 * Supabase auth when configured, single-user fallback otherwise. Keeping the
 * fallback here (rather than in every page) is what lets the app run locally
 * with no accounts while still supporting real sessions in production.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  if (!env.supabaseUrl || !env.supabaseAnonKey) return fallback;

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (updates) => {
          try {
            updates.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components cannot set cookies; the proxy refreshes them.
          }
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    if (!data.user) return fallback;

    return {
      id: data.user.id,
      name:
        (data.user.user_metadata?.full_name as string | undefined) ??
        data.user.email?.split("@")[0] ??
        "Learner",
      email: data.user.email ?? null,
      avatarUrl: (data.user.user_metadata?.avatar_url as string | undefined) ?? null,
    };
  } catch {
    return fallback;
  }
}
