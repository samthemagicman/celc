import cookie from "js-cookie";
import { create } from "zustand";
import { trpc } from "~/lib/api";

export const useAuth = create(() => ({
  startDiscordLogin: async () => {
    const { codeVerifier, url } = await trpc.login.discord.query.query();
    cookie.set("code_verifier", codeVerifier, {
      secure: true,
      sameSite: "strict",
    });
    window.open(url.toString(), "_self");
  },
  exchangePkceCode: async () => {
    return await trpc.login.discord.exchangePkceCode.query();
  },
  logout: async () => {
    await trpc.user.logout.mutate();
    // refresh page
    window.location.reload();
  },
  getUserInfo: async () => {
    return trpc.user.getInfo.query().catch(() => null);
  },
}));
