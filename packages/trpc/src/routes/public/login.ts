import { z } from "zod";
import { discord, storeJwt } from "../../lib/auth";
import { getCookie } from "../../lib/cookies";
import { publicProcedure, router } from "../../trpc";

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

      console.log("Exchanging code for tokens", { authCode });
      const tokens = await discord.validateAuthorizationCode(authCode);
      const accessToken = tokens.accessToken();
      const refreshToken = tokens.refreshToken();

      await storeJwt({
        accessToken,
        refreshToken,
        res: ctx.res,
      });
    }),
});

export const loginRouter = router({
  discord: discordLoginRouter,
});
