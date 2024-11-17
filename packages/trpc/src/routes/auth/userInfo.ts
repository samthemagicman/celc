import { discordAuth } from "../../lib/auth";
import { authProcedure, router } from "../../trpc";

export const userRouter = router({
  getInfo: authProcedure.query(async ({ ctx }) => {
    return ctx.userInfo;
  }),
  logout: authProcedure.mutation(async ({ ctx }) => {
    await discordAuth.logout(ctx.req!, ctx.res!);
  }),
});
