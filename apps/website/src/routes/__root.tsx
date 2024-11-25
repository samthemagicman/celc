import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import React from "react";
import { useAuth } from "~/components/auth";
import { Button } from "~/components/ui/button";

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
  const isLoggedIn = useAuth((s) => s.isLoggedIn)();
  function login() {
    auth.startDiscordLogin();
  }
  function logout() {
    auth.logout();
  }
  return (
    <>
      <div className="py-2 px-4 flex gap-4 items-center">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/admin" className="[&.active]:font-bold">
          Admin
        </Link>{" "}
        {/* {Conditional rendering cool stuff} */}
        {isLoggedIn && (
          <Link to="/my-calendar" className="[&.active]:font-bold">
            My Calendar
          </Link>
        )}
        <div className="w-full" />
        {!isLoggedIn ? (
          <Button onClick={login}>Login</Button>
        ) : (
          <Button onClick={logout}>Logout</Button>
        )}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  component: MainRoute,
});
