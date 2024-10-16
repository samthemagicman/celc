import { db } from "@repo/database";
import { appRouter, createContext } from "@repo/trpc";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

const server = createHTTPServer({
  router: appRouter,
  createContext: async (opt) => {
    return createContext(
      {
        db,
      },
      opt,
    );
  },
});

server.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
