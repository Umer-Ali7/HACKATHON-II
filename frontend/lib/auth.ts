import { betterAuth } from "better-auth";
import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";

/**
 * Lazy-initialized database instance to avoid build-time connection issues.
 * The database connection is only created when actually needed at runtime.
 */
let db: Kysely<unknown> | null = null;

function getDatabase(): Kysely<unknown> {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    db = new Kysely({
      dialect: new PostgresJSDialect({
        postgres: postgres(process.env.DATABASE_URL),
      }),
    });
  }
  return db;
}

/**
 * Lazy-initialized Better Auth instance.
 * This prevents database connection attempts during build time.
 */
let authInstance: ReturnType<typeof betterAuth> | null = null;

function getAuth(): ReturnType<typeof betterAuth> {
  if (!authInstance) {
    if (!process.env.BETTER_AUTH_SECRET) {
      throw new Error("BETTER_AUTH_SECRET environment variable is not set");
    }

    authInstance = betterAuth({
      database: getDatabase(),
      secret: process.env.BETTER_AUTH_SECRET,
      emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
      },
      session: {
        cookieCache: {
          enabled: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
        },
      },
    });
  }
  return authInstance;
}

/**
 * Better Auth configuration for authentication
 *
 * Uses PostgreSQL (Neon) for user storage and session management.
 * Generates JWT tokens with 7-day expiry, stored in httpOnly cookies for security.
 *
 * Exported as a getter to enable lazy initialization and avoid build-time issues.
 */
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(_, prop) {
    return (getAuth() as Record<string, unknown>)[prop as string];
  },
});

/**
 * Type exports for Better Auth session
 */
export type Session = ReturnType<typeof betterAuth>["$Infer"]["Session"];
