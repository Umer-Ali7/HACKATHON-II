import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth API route handler for Next.js App Router
 *
 * This catch-all route handles all Better Auth endpoints:
 * - POST /api/auth/sign-up
 * - POST /api/auth/sign-in
 * - POST /api/auth/sign-out
 * - GET /api/auth/session
 * - And other Better Auth endpoints
 */
export const { GET, POST } = toNextJsHandler(auth);
