import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useAuth } from "~/components/auth";
import { Button } from "~/components/ui/button";

const MainRoute = () => {
  const auth = useAuth();
  const isLoggedIn = useAuth((s) => s.loggedIn);
  function login() {
    auth.startDiscordLogin();
  }
  function logout() {
    auth.logout();
  }
  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
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
