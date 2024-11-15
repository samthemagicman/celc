import { eventRouter } from "./routes/admin/events";
import { userRouter } from "./routes/auth/userInfo";
import { loginRouter } from "./routes/public/login";
import { testRouter } from "./routes/public/test";
import { router } from "./trpc";

export const appRouter = router({
  test: testRouter,
  event: eventRouter,
  login: loginRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export { createContext } from "./trpc";
