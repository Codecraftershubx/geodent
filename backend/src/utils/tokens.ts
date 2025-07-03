import jwt from "jsonwebtoken";
import config from "../config.js";
import type { TAccessTokenPayload, TDecomposeResult } from "./types.js";

export default {
  // generate tokens
  generate: {
    accessToken: (
      payload: TAccessTokenPayload,
      options: object = {
        expiresIn: config.expirations.accessToken,
      }
    ): string => {
      if (!config.authSecret) {
        throw new Error("authSecret env var not defined");
      }
      return jwt.sign(payload, config.authSecret, options);
    },

    refreshToken: (
      payload: TAccessTokenPayload,
      options: object = {
        expiresIn: config.expirations.refreshToken,
      }
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
        ) as TAccessTokenPayload;
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
        ) as TAccessTokenPayload;
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
