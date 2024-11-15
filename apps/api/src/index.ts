import { db } from "@repo/database";
import { appRouter, createContext } from "@repo/trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";

const app = express();

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

app.listen(process.env.API_PORT ?? 3000);
