import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Link, useMatchRoute } from "@tanstack/react-router";
import React from "react";
import { createPortal } from "react-dom";
import { useAuth } from "~/components/auth";
import { useBreakpoint } from "~/hooks/tailwind";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";

const navbarLinks = [
  { to: "/", label: "Events" },
  { to: "/my-calendar", label: "My Calendar", authOnly: true },
  { to: "/admin", label: "Admin", role: "admin" },
];

const HamburgerButton: React.FC<{ onClick: () => void; active?: boolean }> = ({
  onClick,
  active,
}) => {
  return (
    <button onClick={onClick} className="z-50">
      {active ? (
        <Cross1Icon height={32} width={32} className="text-[#c4326d]" />
      ) : (
        <HamburgerMenuIcon height={32} width={32} />
      )}
    </button>
  );
};

const NavbarLink: React.FC<{
  to: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ to, children, className, onClick }) => {
  const ref = React.useRef<HTMLAnchorElement>(null);
  let isActive = false;
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: to });

  if (params) {
    isActive = true;
  }

  return (
    <Link
      onClick={onClick}
      ref={ref}
      to={to}
      className={cn(
        "py-2 flex-none leading-tight",
        {
          "underline underline-offset-8": isActive,
        },
        className,
      )}
    >
      {children}
    </Link>
  );
};

export const MobileNavMenu: React.FC<{ onButtonClicked: () => void }> = ({
  onButtonClicked,
}) => {
  const auth = useAuth();
  const jwt = auth.getJwtPayload();
  const isLoggedIn = useAuth((s) => s.isLoggedIn)();
  function login() {
    auth.startDiscordLogin();
  }
  function logout() {
    auth.logout();
  }
  return createPortal(
    <div className="fixed inset-0 bg-[#ffdd65] text-[#c4326d] z-40 flex items-center justify-center flex-col gap-8 text-4xl font-semibold">
      {navbarLinks.map((link) => {
        if (link.role && link.role !== jwt?.role) {
          return null;
        }
        if (link.authOnly && !isLoggedIn) {
          return null;
        }
        return (
          <NavbarLink key={link.to} to={link.to} onClick={onButtonClicked}>
            {link.label}
          </NavbarLink>
        );
      })}
      {!isLoggedIn ? (
        <Button
          onClick={login}
          className="h-auto w-auto text-4xl bg-[#c4326d] hover:bg-[#c4326d]/90"
        >
          Login
        </Button>
      ) : (
        <Button
          onClick={logout}
          className="h-auto w-auto text-4xl bg-[#c4326d] hover:bg-[#c4326d]/90"
        >
          Logout
        </Button>
      )}
    </div>,
    document.body,
  );
};

export const Navbar: React.FC = () => {
  const auth = useAuth();
  const jwt = auth.getJwtPayload();
  const isMobile = !useBreakpoint("sm");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isLoggedIn = useAuth((s) => s.isLoggedIn)();
  function login() {
    auth.startDiscordLogin();
  }
  function logout() {
    auth.logout();
  }

  return (
    <div className="py-2 px-4 bg-[#212121] text-white">
      <div className="max-w-screen-xl mx-auto flex items-center gap-4">
        <img src="/celc-logo.png" alt="logo" className="h-12 z-50" />
        {!isMobile && (
          <div className="flex text-white items-center gap-8 pl-4 flex-1 justify-center md:justify-start">
            {navbarLinks.map((link) => {
              if (link.role && link.role !== jwt?.role) {
                return null;
              }
              if (link.authOnly && !isLoggedIn) {
                return null;
              }
              return (
                <NavbarLink key={link.to} to={link.to}>
                  {link.label}
                </NavbarLink>
              );
            })}
          </div>
        )}
        {isMobile ? (
          <>
            <div className="flex-1" />
            <HamburgerButton
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
              active={menuOpen}
            />
          </>
        ) : (
          <>
            {!isLoggedIn ? (
              <Button onClick={login}>Login</Button>
            ) : (
              <Button onClick={logout}>Logout</Button>
            )}
          </>
        )}

        {isMobile && menuOpen && (
          <MobileNavMenu
            onButtonClicked={() => {
              setMenuOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};
