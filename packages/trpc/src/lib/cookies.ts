import cookie, { SerializeOptions } from "cookie";
import { IncomingMessage, ServerResponse } from "http";

export function getCookies(req: Request) {
  const cookieHeader = req.headers.get("Cookie");
  if (!cookieHeader) return {};
  return cookie.parse(cookieHeader);
}

export function deleteCookie(
  resHeaders: ServerResponse,
  name: string,
  options?: SerializeOptions,
) {
  resHeaders.appendHeader(
    "Set-Cookie",
    cookie.serialize(name, "", { maxAge: -1, ...options }),
  );
}

export function getCookie(req: IncomingMessage, name: string) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return;
  const cookies = cookie.parse(cookieHeader);
  return cookies[name];
}

export function setCookie(
  resHeaders: ServerResponse,
  name: string,
  value: string,
  options?: SerializeOptions,
) {
  resHeaders.appendHeader("Set-Cookie", cookie.serialize(name, value, options));
}
