import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "~/components/auth";

export const Route = createFileRoute("/auth/callback")({
  component: Index,
  loader: async () => {
    await useAuth.getState().exchangePkceCode();
    throw redirect({
      to: "/",
      replace: true,
    });
  },
  pendingComponent: () => <div>Logging in</div>,
});

function Index() {
  return <div className="p-2">Logging In</div>;
}
