import { createRootRoute, Outlet } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { Navbar } from "~/components/navbar";
import { useAuth } from "~/hooks/use-auth";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

const MainRoute = () => {
  const auth = useAuth();
  useEffect(() => {
    auth.fetchUserInfo();
  }, []);
  return (
    <>
      <Navbar />
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  component: MainRoute,
});
