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
  query: publicProcedure.query(async ({ctx}) => {
    const isProduction = process.env.NODE_ENV === 'production';
    let host = ctx.req?.headers.host ?? ctx.req?.headers['x-forwarded-host'];
    if (Array.isArray(host)) {
      host = host[0]
    }
    return discordAuth.getCodeVerifierAndUrl(isProduction ? `https://${host}` : undefined);
  })
})

export const loginRouter = router({
  discord: discordLoginRouter,
})