import { logout } from "../../lib/auth";
import { authProcedure, publicProcedure, router } from "../../trpc";

export const userRouter = router({
  getInfo: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userInfo) {
      return null;
    }
    return ctx.userInfo;
  }),
  logout: authProcedure.mutation(async ({ ctx }) => {
    await logout(ctx.res!);
  }),
});
