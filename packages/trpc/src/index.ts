import { testRouter } from "./routes/public/test";
import { router } from "./trpc";

export const appRouter = router({
  test: testRouter,
});

export type AppRouter = typeof appRouter;
