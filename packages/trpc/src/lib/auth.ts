import { db, eq, schema } from "@repo/database";
import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import * as oidclient from "openid-client";
import { deleteCookie, getCookie, setCookie } from "./cookies";
import { verifyOrCreateUserInDatabase } from "./user";

if (!process.env.DISCORD_CLIENT_ID) {
  throw new Error("No DISCORD_CLIENT_ID");
}
if (!process.env.AUTH_SIGNING_KEY) {
  throw new Error("No AUTH_SIGNING_KEY");
}

type UserInfo = {
  role: string;
  id: string;
  username: string;
  email: string;
};

const CookieNames = {
  AccessToken: "access_token",
  CodeVerifier: "code_verifier",
  JsonWebToken: "jwt",
  RefreshToken: "refresh_token",
  AccessTokenExpiration: "access_token_expiration",
} as const;

const discordOauthConfig = new oidclient.Configuration(
  {
    issuer: "https://discord.com",
    revocation_endpoint: "https://discord.com/api/oauth2/token/revoke",
    userinfo_endpoint: "https://discord.com/api/users/@me",
    token_endpoint: "https://discord.com/api/oauth2/token",
    authorization_endpoint: "https://discord.com/api/oauth2/authorize",
    scopes_supported: ["email", "identify"],
  },
  process.env.DISCORD_CLIENT_ID,
);

const signingKey = process.env.AUTH_SIGNING_KEY;

function getUserRole(userId: string) {
  return db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .then((users) => users[0].role);
}

export const discordAuth = {
  logout: async (_req: IncomingMessage, res: ServerResponse) => {
    // Discord doesn't provide token revocation, so we would have to create a custom solution. For now, we just delete the cookies.

    deleteCookie(res, CookieNames.AccessToken);
    deleteCookie(res, CookieNames.RefreshToken);
    deleteCookie(res, CookieNames.JsonWebToken, {
      path: "/",
    });
    deleteCookie(res, CookieNames.CodeVerifier, {
      path: "/",
    });
  },
  exchangePkceCode: async (url: URL, pkceCodeVerifier: string) => {
    return await oidclient.authorizationCodeGrant(discordOauthConfig, url, {
      pkceCodeVerifier,
    });
  },
  getUserData: async (accessToken: string) => {
    const userInfo = await oidclient.fetchProtectedResource(
      discordOauthConfig,
      accessToken,
      new URL("https://discord.com/api/users/@me"),
      "GET",
    );
    const userInfoJson = await userInfo.json();

    if (userInfoJson.id === undefined) {
      throw new Error("No user ID");
    }
    if (userInfoJson.username === undefined) {
      throw new Error("No username");
    }

    return userInfoJson as UserInfo;
  },
  getJwt: async (userData: UserInfo) => {
    return jwt.sign(
      {
        username: userData.username,
        sub: userData.id,
        iss: "https://discord.com",
        aud: [process.env.DISCORD_CLIENT_ID],
        role: userData.role,
      },
      signingKey,
      {
        expiresIn: "15m",
        algorithm: "RS256",
      },
    );
  },
  refreshAccessToken: async (refreshToken: string) => {
    const tokenSet = await oidclient.refreshTokenGrant(
      discordOauthConfig,
      refreshToken,
    );
    return tokenSet;
  },
  getCodeVerifierAndUrl: async (uri: string | undefined) => {
    const codeVerifier = oidclient.randomPKCECodeVerifier();
    const codeChallenge =
      await oidclient.calculatePKCECodeChallenge(codeVerifier);
    const parameters = {
      redirect_uri: uri
        ? `${uri}/auth/callback`
        : "http://localhost:5173/auth/callback",
      scope: "email identify",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    };
    const url = oidclient.buildAuthorizationUrl(discordOauthConfig, parameters);
    return { codeVerifier, url };
  },
};

const setAuthCookies = async (
  res: ServerResponse,
  tokens: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    jwt?: string;
  },
) => {
  if (tokens.jwt)
    setCookie(res, CookieNames.JsonWebToken, tokens.jwt, {
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });
  if (tokens.refresh_token)
    setCookie(res, CookieNames.RefreshToken, tokens.refresh_token, {
      secure: true,
      sameSite: "strict",
    });
  if (tokens.access_token)
    setCookie(res, CookieNames.AccessToken, tokens.access_token, {
      secure: true,
      sameSite: "strict",
      maxAge: tokens.expires_in,
    });
};

export const exchangeOauthCodeAndSetCookies = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const codeVerifier = getCookie(req, CookieNames.CodeVerifier);

  if (!req.headers.referer) {
    throw new Error("No referer");
  }
  if (!codeVerifier) {
    throw new Error("No code verifier");
  }
  const codeChallenge = await discordAuth.exchangePkceCode(
    new URL(req.headers.referer),
    codeVerifier,
  );

  const accessToken = codeChallenge.access_token;
  const refreshToken = codeChallenge.refresh_token;
  const userInfo = await discordAuth.getUserData(accessToken);
  await verifyOrCreateUserInDatabase(
    userInfo.id,
    userInfo.username,
    userInfo.email,
  );
  userInfo.role = await getUserRole(userInfo.id);
  const jwt = await discordAuth.getJwt(userInfo);

  setAuthCookies(res, {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: codeChallenge.expires_in,
    jwt,
  });
};

const validateAccessTokenFromReq = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const accessTokenCookie = getCookie(req, CookieNames.AccessToken);

  if (!accessTokenCookie) {
    const refreshTokenCookie = getCookie(req, CookieNames.RefreshToken);
    if (!refreshTokenCookie) {
      return null;
    }
    const tokens = await discordAuth.refreshAccessToken(refreshTokenCookie);
    await setAuthCookies(res, tokens);
    return tokens.access_token;
  }

  return accessTokenCookie;
};

export const validateJwtFromReq = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  let jwtCookie = getCookie(req, CookieNames.JsonWebToken);
  let verifiedJwt = null;

  if (!jwtCookie) {
    const accessToken = await validateAccessTokenFromReq(req, res);
    if (!accessToken) {
      return null;
    }
    try {
      jwtCookie = await discordAuth.getJwt(
        await discordAuth.getUserData(accessToken),
      );
      setAuthCookies(res, { jwt: jwtCookie });
    } catch {
      return null;
    }
  }

  try {
    verifiedJwt = jwt.verify(jwtCookie, signingKey, {
      audience: process.env.DISCORD_CLIENT_ID,
    }) as { username: string; sub: string; role: string };
  } catch (err) {
    const jwtError = err as jwt.JsonWebTokenError;
    switch (jwtError.name) {
      case "TokenExpiredError": {
        const accessToken = await validateAccessTokenFromReq(req, res);
        if (!accessToken) {
          return null;
        }
        const newJwt = await discordAuth.getJwt(
          await discordAuth.getUserData(accessToken),
        );
        setAuthCookies(res, { jwt: newJwt });
        verifiedJwt = jwt.verify(newJwt, signingKey, {
          audience: process.env.DISCORD_CLIENT_ID,
        }) as { username: string; sub: string; role: string };
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
