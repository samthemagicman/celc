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

// app.get("/auth/callback", async (req, res) => {
//   res.send("callback");
// })

app.listen(process.env.API_PORT ?? 3000);

// const server = createHTTPServer({
//   router: appRouter,
//   createContext: async (opt) => {
//     return createContext(
//       {
//         db,
//       },
//       opt,
//     );
//   },
// });

// server.listen(3000, () => {
//   console.log("Listening on http://localhost:3000");
// });
