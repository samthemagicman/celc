import { ArcticFetchError, OAuth2RequestError, generateState } from "arctic";
import { z } from "zod";
import { discord, storeJwt } from "../../lib/auth";
import { getCookie, setCookie } from "../../lib/cookies";
import { publicProcedure, router } from "../../trpc";
const isProduction = process.env.NODE_ENV === "production";

const discordLoginRouter = router({
  exchangePkceCode: publicProcedure
    .input(
      z.object({
        code: z.string(),
        state: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.req) {
        throw new Error("No request");
      }
      if (!ctx.res) {
        throw new Error("No response");
      }
      if (!ctx.req.url) {
        throw new Error("No URL");
      }

      const authCode = input.code;
      const urlState = input.state;
      const storedState = getCookie(ctx.req, "state");

      if (!storedState) {
        throw new Error("No stored state");
      }
      if (urlState !== storedState) {
        throw new Error("State mismatch");
      }
      if (!urlState) {
        throw new Error("No state");
      }
      if (!authCode) {
        throw new Error("No auth code");
      }

      try {
        const tokens = await discord.validateAuthorizationCode(authCode);
        const accessToken = tokens.accessToken();
        const refreshToken = tokens.refreshToken();
        const accessTokenExpiresAt = tokens.accessTokenExpiresAt();

        await storeJwt({
          accessToken,
          refreshToken,
          accessTokenExpiresAt,
          res: ctx.res,
        });
      } catch (e) {
        if (e instanceof OAuth2RequestError) {
          const code = e.code;
          console.log(code);
        }
        if (e instanceof ArcticFetchError) {
          const cause = e.cause;
          console.log(cause);
        }
      }
    }),
  query: publicProcedure.query(async ({ ctx }) => {
    let host = ctx.req?.headers.host ?? ctx.req?.headers["x-forwarded-host"];
    if (Array.isArray(host)) {
      host = host[0];
    }
    const state = generateState();
    const scopes = ["email"];
    const url = discord.createAuthorizationURL(state, scopes);

    setCookie(ctx.res!, "state", state, {
      secure: isProduction,
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10,
    });

    return url;
  }),
});

export const loginRouter = router({
  discord: discordLoginRouter,
});
