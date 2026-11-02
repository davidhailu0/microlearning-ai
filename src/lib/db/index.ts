import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  __lumenSql?: ReturnType<typeof postgres>;
  __lumenDb?: Db;
};

export function getDb(): Db {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Set it or run in demo mode.");
  }

  if (!globalForDb.__lumenDb) {
    // `prepare: false` keeps us compatible with Supabase's transaction pooler.
    globalForDb.__lumenSql = postgres(process.env.DATABASE_URL, {
      max: 5,
      prepare: false,
      idle_timeout: 20,
    });
    globalForDb.__lumenDb = drizzle(globalForDb.__lumenSql, { schema });
  }

  return globalForDb.__lumenDb;
}

export const dbEnabled = () => Boolean(process.env.DATABASE_URL);
export { schema };
