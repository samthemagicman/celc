import { appRouter } from "@repo/trpc";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
