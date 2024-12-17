import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "~/hooks/use-auth";

export const Route = createFileRoute("/auth/callback")({
  component: Index,
  beforeLoad: async () => {},
  loader: async () => {
    await useAuth.getState().exchangePkceCode();
    throw redirect({
      to: "/",
      replace: true,
    });
  },
  onLeave: async () => {
    await useAuth.getState().fetchUserInfo();
  },
  pendingComponent: () => <div>Logging in</div>,
});

function Index() {
  return <div className="p-2">Logging In</div>;
}
