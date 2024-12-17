import { logout } from "../../lib/auth";
import { publicProcedure, router } from "../../trpc";

export const userRouter = router({
  getInfo: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userInfo) {
      return null;
    }
    return ctx.userInfo;
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    await logout(ctx.res!);
  }),
});
