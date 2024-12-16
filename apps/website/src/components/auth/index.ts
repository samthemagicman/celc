import * as jose from "jose";
import cookie from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trpc } from "~/lib/api";

type AuthStore = {
  startDiscordLogin: () => Promise<void>;
  exchangePkceCode: () => Promise<void>;
  logout: () => Promise<void>;
  userInfo: Awaited<ReturnType<typeof trpc.user.getInfo.query>> | null;
  isLoggedIn: () => boolean;
  getJwtPayload: () => {
    username: string;
    role: string;
  } | null;
};

export const useAuth = create(
  persist<AuthStore>(
    (set, get) => ({
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
        set({ userInfo });
      },
      logout: async () => {
        await trpc.user.logout.mutate();
        set({ userInfo: null });
      },
      getJwtPayload: () => {
        const jwt = cookie.get("jwt");
        if (jwt) {
          const payload = jose.decodeJwt(jwt);
          return payload as {
            username: string;
            role: string;
          };
        } else {
          return null;
        }
      },
      isLoggedIn: () => {
        const jwt = cookie.get("jwt");
        if (jwt) {
          if (get().userInfo === null) {
            trpc.user.getInfo.query().then((userInfo) => {
              set({ userInfo });
            });
          }
          return true;
        } else {
          return false;
        }
      },
      userInfo: null,
    }),
    {
      name: "auth",
    },
  ),
);
