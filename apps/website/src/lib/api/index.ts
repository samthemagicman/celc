import type { AppRouter } from "@repo/trpc";
//     👆 **type-only** import
import { createTRPCClient, httpBatchLink } from "@trpc/client";

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api",
    }),
  ],
});
