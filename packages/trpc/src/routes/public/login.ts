import { discordAuth, exchangeOauthCodeAndSetCookies } from '../../lib/auth';
import { publicProcedure, router } from "../../trpc";

const discordLoginRouter = router({
  exchangePkceCode: publicProcedure.query(async ({ctx}) => {
    if (!ctx.req) {
      throw new Error("No request")
    }
    if (!ctx.res) {
      throw new Error("No response")
    }
    await exchangeOauthCodeAndSetCookies(ctx.req, ctx.res);
  }),
  query: publicProcedure.query(async () => {
    return discordAuth.getCodeVerifierAndUrl();
  })
})

export const loginRouter = router({
  discord: discordLoginRouter,
})