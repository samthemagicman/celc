import { db } from "@repo/database";
import { initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

type CreateContextOptions = {
  db: typeof db;
};

export type Context = {
  db: typeof db;
  req?: CreateHTTPContextOptions["req"];
  res?: CreateHTTPContextOptions["res"];
};

export async function createContext(
  contextInner: CreateContextOptions,
  opts?: CreateHTTPContextOptions,
): Promise<Context> {
  return {
    ...contextInner,
    req: opts?.req,
    res: opts?.res,
  };
}

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const adminProcedure = publicProcedure.use(async (opts) => {
  if (!opts.ctx.req) {
    throw new Error("No request");
  }

  return opts.next();
});
