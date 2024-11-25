import { eventRouter } from "./routes/admin/events";
import { UserCalendarRouter } from "./routes/auth/user-calendar";
import { userRouter } from "./routes/auth/userInfo";
import { loginRouter } from "./routes/public/login";
import { testRouter } from "./routes/public/test";
import { router } from "./trpc";

export const appRouter = router({
  test: testRouter,
  event: eventRouter,
  login: loginRouter,
  user: userRouter,
  userEvents: UserCalendarRouter,
});

export type AppRouter = typeof appRouter;

export { createContext } from "./trpc";
