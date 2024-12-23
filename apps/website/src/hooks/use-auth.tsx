import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trpc } from "~/lib/api";
type AuthStore = {
  authState: "unknown" | "loggedOut" | "loggedIn";
  isLoggedIn: boolean;
  startDiscordLogin: () => Promise<void>;
  exchangePkceCode: () => Promise<void>;
  logout: () => Promise<void>;
  userInfo: Awaited<ReturnType<typeof trpc.user.getInfo.query>> | null;
  fetchUserInfo: () => Promise<void>;
};

export const useAuth = create(
  persist<AuthStore>(
    (set) => ({
      authState: "unknown",
      isLoggedIn: false,
      userInfo: null,
      fetchUserInfo: async () => {
        try {
          const userInfo = await trpc.user.getInfo.query().catch(() => null);
          if (userInfo) {
            set({ userInfo, authState: "loggedIn", isLoggedIn: true });
          }
        } catch {
          set({ userInfo: null, authState: "unknown", isLoggedIn: false });
        }
      },
      startDiscordLogin: async () => {
        const url = await trpc.login.discord.query.query();
        window.open(url, "_self");
      },
      exchangePkceCode: async () => {
        const url = new URL(window.location.href);
        const authCode = url.searchParams.get("code");
        const urlState = url.searchParams.get("state");
        if (!authCode || !urlState) {
          throw new Error("No auth code or state");
        }
        await trpc.login.discord.exchangePkceCode.query({
          code: authCode,
          state: urlState,
        });
        const userInfo = await trpc.user.getInfo.query().catch(() => null);
        set({ userInfo });
      },
      logout: async () => {
        await trpc.user.logout.mutate();
        set({ userInfo: null, authState: "loggedOut", isLoggedIn: false });
      },
    }),
    {
      name: "auth",
    },
  ),
);
