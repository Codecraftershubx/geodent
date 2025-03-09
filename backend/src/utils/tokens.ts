import jwt from "jsonwebtoken";
import config from "../config.js";
import type { TPayload, TDecomposeResult } from "./types.js";

export default {
  // generate tokens
  generate: {
    accessToken: (
      payload: TPayload,
      options: object = {
        expiresIn: "2h",
      },
    ): string => {
      if (!config.authSecret) {
        throw new Error("authSecret env var not defined");
      }
      return jwt.sign(payload, config.authSecret, options);
    },

    refreshToken: (
      payload: TPayload,
      options: object = {
        expiresIn: "7d",
      },
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
        const payload = jwt.verify(token, config.authSecret) as TPayload;
        return { payload, expired: false };
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return { payload: null, expired: true };
        }
        throw err;
      }
    },

    refreshToken: (token: string): TDecomposeResult => {
      try {
        if (!config.refreshSecret) {
          throw new Error("refreshSecret env var not defined");
        }
        const payload = jwt.verify(token, config.refreshSecret) as TPayload;
        return { payload, expired: false };
      } catch (err) {
        throw err;
      }
    },
  },
};
