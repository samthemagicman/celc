import cookie from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trpc } from "~/lib/api";

type AuthStore = {
  startDiscordLogin: () => Promise<void>;
  exchangePkceCode: () => Promise<void>;
  logout: () => Promise<void>;
  userInfo: Awaited<ReturnType<typeof trpc.user.getInfo.query>> | null;
  loggedIn: boolean;
};

export const useAuth = create(
  persist<AuthStore>(
    (set) => ({
      startDiscordLogin: async () => {
        const { codeVerifier, url } = await trpc.login.discord.query.query();
        cookie.set("code_verifier", codeVerifier, {
          secure: true,
          sameSite: "strict",
        });
        window.open(url.toString(), "_self");
      },
      exchangePkceCode: async () => {
        await trpc.login.discord.exchangePkceCode.query();
        const userInfo = await trpc.user.getInfo.query().catch(() => null);
        set({ loggedIn: true, userInfo });
      },
      logout: async () => {
        await trpc.user.logout.mutate();
        set({ loggedIn: false, userInfo: null });
      },
      loggedIn: false,
      userInfo: null,
    }),
    {
      name: "auth",
    },
  ),
);
