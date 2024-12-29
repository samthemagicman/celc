import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import { deleteCookie, getCookie, setCookie } from "./cookies";
import { verifyOrCreateUserInDatabase } from "./user";
const isProduction = process.env.NODE_ENV === "production";

import { Discord } from "arctic";

if (!process.env.DISCORD_CLIENT_ID) {
  throw new Error("No DISCORD_CLIENT_ID");
}
if (!process.env.DISCORD_CLIENT_SECRET) {
  throw new Error("No DISCORD_CLIENT_SECRET");
}
if (!process.env.AUTH_SIGNING_KEY) {
  throw new Error("No AUTH_SIGNING_KEY");
}

const signingKey = process.env.AUTH_SIGNING_KEY;

export type UserProfile = {
  role: string;
  id: string;
  username: string;
  email: string;
};

export const discord = new Discord(
  process.env.DISCORD_CLIENT_ID,
  process.env.DISCORD_CLIENT_SECRET,
  process.env.DISCORD_REDIRECT_URI ?? "http://localhost:5173/auth/callback",
);

export const logout = async (res: ServerResponse) => {
  deleteCookie(res, "jwt", { path: "/" });
  deleteCookie(res, "refreshToken", { path: "/" });
};

export const storeJwt = async ({
  accessToken,
  refreshToken,
  res,
}: {
  accessToken: string;
  refreshToken: string;
  res: ServerResponse;
}) => {
  const userProfile = await getUserDiscordProfile(accessToken);

  console.log("Saving JWT for", { userProfile: userProfile });

  const user = await verifyOrCreateUserInDatabase(
    userProfile.id,
    userProfile.username,
    userProfile.email,
  );

  const jwt = generateJwt(user);

  setCookie(res, "jwt", jwt, {
    secure: isProduction,
    httpOnly: true,
    path: "/",
  });
  setCookie(res, "refreshToken", refreshToken, {
    secure: isProduction,
    httpOnly: true,
    path: "/",
  });

  return jwt;
};

export const getUserDiscordProfile = async (accessToken: string) => {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const userProfile = (await response.json()) as UserProfile;

  return userProfile;
};

export function generateJwt(profile: UserProfile) {
  return jwt.sign(
    {
      username: profile.username,
      sub: profile.id,
      iss: "https://discord.com",
      aud: [process.env.DISCORD_CLIENT_ID],
      role: profile.role,
    },
    signingKey,
    {
      expiresIn: "30d", // seconds
      algorithm: "RS256",
    },
  );
}

export const validateJwtFromReq = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const jwtCookie = getCookie(req, "jwt");
  let verifiedJwt = null;

  if (!jwtCookie) {
    return null;
  }

  try {
    verifiedJwt = jwt.verify(jwtCookie, signingKey, {
      audience: process.env.DISCORD_CLIENT_ID,
    }) as { username: string; sub: string; role: string };
  } catch (err) {
    const jwtError = err as jwt.JsonWebTokenError;
    switch (jwtError.name) {
      case "TokenExpiredError": {
        const refreshTokenCookie = getCookie(req, "refreshToken");
        if (!refreshTokenCookie) {
          return null;
        }
        try {
          const tokens = await discord.refreshAccessToken(refreshTokenCookie);
          const accessToken = tokens.accessToken();
          const refreshToken = tokens.refreshToken();

          const jwtToken = await storeJwt({
            accessToken,
            refreshToken,
            res,
          });

          verifiedJwt = jwt.verify(jwtToken, signingKey, {
            audience: process.env.DISCORD_CLIENT_ID,
          }) as { username: string; sub: string; role: string };
        } catch {
          return null;
        }
        break;
      }
    }
  }

  if (!verifiedJwt) {
    return null;
  }

  return {
    username: verifiedJwt.username,
    userId: verifiedJwt.sub,
    role: verifiedJwt.role,
  };
};
