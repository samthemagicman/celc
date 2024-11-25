import { db } from "@repo/database";
import { initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { validateJwtFromReq } from "./lib/auth";

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
// Authenticated procedure
export const authProcedure = publicProcedure.use(async (opts) => {
  if (!opts.ctx.req) {
    throw new Error("No request");
  }
  if (!opts.ctx.res) {
    throw new Error("No response");
  }

  const userInfo = await validateJwtFromReq(opts.ctx.req, opts.ctx.res);

  if (!userInfo) {
    throw new Error("Unauthorized");
  }

  return opts.next({
    ctx: {
      userInfo,
    },
  });
});
export const adminProcedure = authProcedure.use(async (opts) => {
  if (!opts.ctx.req) {
    throw new Error("No request");
  }
  if (opts.ctx.userInfo.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return opts.next();
});
