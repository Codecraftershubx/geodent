import jwt from "jsonwebtoken";
import config from "../config.js";
import type { TDecomposeResult, TJwtPayload, TokenTimesType } from "./types.js";

export default {
  // generate tokens
  generate: {
    accessToken: (
      payload: TJwtPayload,
      options: object = {}
    ): string => {
      if (!config.authSecret) {
        throw new Error("authSecret env var not defined");
      }
      return jwt.sign(payload, config.authSecret, options);
    },

    refreshToken: (
      payload: TJwtPayload,
      options: object = {}
    ): string => {
      if (!config.refreshSecret) {
        throw new Error("refreshSecret env var not defined");
      }
      return jwt.sign(payload, config.refreshSecret, options);
    },
  },

  // extract payload from token
  decompose: {
    accessToken: (token: string): TDecomposeResult => {
      try {
        if (!config.authSecret) {
          throw new Error("authSecret env var not defined");
        }
        const payload = jwt.verify(
          token,
          config.authSecret
        ) as TJwtPayload;
        return { payload };
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return { payload: null };
        }
        throw err;
      }
    },

    refreshToken: (token: string): TDecomposeResult => {
      try {
        if (!config.refreshSecret) {
          throw new Error("refreshSecret env var not defined");
        }
        const payload = jwt.verify(
          token,
          config.refreshSecret
        ) as TJwtPayload;
        return { payload };
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return { payload: null };
        }
        throw err;
      }
    },
  },
};

/**
 * getTokenTimes - generates issued_at and expires_at times for
 * access and refresh tokens
 */
const getTokenTimes = (
	tokenType: "accessToken" | "refreshToken",
	start: number = -1
): TokenTimesType => {
	const iat = start < 0 ? Date.now(): start;
	const exp = iat + config.expirations[tokenType];
	return { iat, exp };
};

export { getTokenTimes };