import { eventRouter } from "./routes/admin/events";
import { testRouter } from "./routes/public/test";
import { router } from "./trpc";

export const appRouter = router({
  test: testRouter,
  event: eventRouter,
});

export type AppRouter = typeof appRouter;

export { createContext } from "./trpc";
