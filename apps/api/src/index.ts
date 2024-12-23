import { db } from "@repo/database";
import { appRouter, createContext } from "@repo/trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import { Discord, generateState } from "arctic";
import express from "express";

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.DISCORD_CLIENT_ID) {
  throw new Error("No DISCORD_CLIENT_ID");
}
if (!process.env.DISCORD_CLIENT_SECRET) {
  throw new Error("No DISCORD_CLIENT_SECRET");
}
if (!process.env.AUTH_SIGNING_KEY) {
  throw new Error("No AUTH_SIGNING_KEY");
}

export const discord = new Discord(
  process.env.DISCORD_CLIENT_ID,
  process.env.DISCORD_CLIENT_SECRET,
  process.env.DISCORD_REDIRECT_URI ?? "http://localhost:5173/auth/callback",
);

const app = express();

app.get("/", (req, res) => {
  res.send("ok");
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: (opts) => {
      return createContext(
        {
          db,
        },
        opts,
      );
    },
    onError: (opts) => {
      console.error(opts.error, "tRPC error on API");
    },
  }),
);

app.use(express.json());

app.get("/login", (_, res) => {
  const state = generateState();
  const scopes = ["email"];
  const url = discord.createAuthorizationURL(state, scopes);

  res.cookie("state", state, {
    secure: isProduction,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10 * 1000,
    sameSite: "lax",
    domain: process.env.DOMAIN ?? "localhost",
  });

  res.redirect(url.toString());
});

const port = process.env.API_PORT ?? 3000;
app.listen(port);

console.log(`API listening on port ${port}`);
