import { Request, Response } from "express";
import type {
  TAccessTokenPayload,
  TDecomposeResult,
} from "../../../../utils/types.js";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import config from "../../../../../config.js";

const login = async (req: Request, res: Response): Promise<void> => {
  // extract access token
  const authHeader = req.headers.authorization;
  let filtered;

  if (authHeader) {
    const [_, accessToken] = authHeader.split(" ");
    try {
      let data: TDecomposeResult =
        utils.tokens.decompose.accessToken(accessToken);
      if (data.expired) {
        return utils.handlers.error(res, "authentication", {
          message: "access token expired",
        });
      }
      // login authenticated User
      const payload = data.payload as TAccessTokenPayload;

      // get user profile
      const user = await db.client.client.user.findUnique({
        where: { id: payload.id },
      });

      if (!user || user.id !== payload.id) {
        return utils.handlers.error(res, "authentication", {
          message: "unknown user",
        });
      }
      // verify user not already logged in
      const loggedInUser = await utils.cache.get(accessToken);
      if (
        loggedInUser &&
        typeof loggedInUser === "string" &&
        loggedInUser === payload.id
      ) {
        return utils.handlers.error(res, "authentication", {
          message: "already loggedd in",
        });
      }
      // save login session
      const rT = await utils.tokens.generate.refreshToken({ id: payload.id });
      const cacheATRes = await utils.cache.set(accessToken, payload.id, config.expirations.accessToken);
      const cacheRTRes = await utils.cache.set(`${accessToken}:RToken`, rT, config.expirations.refreshToken);
      if (!cacheATRes || !cacheRTRes) {
        throw new Error("Error! Login failed");
      }
      console.log("cacheATRes:", cacheATRes, "cacheRTRes:", cacheRTRes);

      // filter hidden values
      filtered = await db.client.filterModels([user]);
      return utils.handlers.success(res, {
        data: filtered,
        message: "login success",
      });
    } catch (err) {
      // error occured while generating token
      if (err instanceof Error) {
        return utils.handlers.error(res, "general", {
          message: "login failed",
          status: 500,
          data: [{ details: err }],
        });
      }
      // invalid access token
      return utils.handlers.error(res, "authentication", {
        message: "user doesn't exist",
      });
    }
  }

  // no auth header: use user credentials
  const { email, password } = req.body;
  if (!email || !password) {
    const field = email
      ? "password"
      : password
        ? "email"
        : "email and password";
    return utils.handlers.error(res, "authentication", {
      message: `${field} not provided`,
    });
  }
  // verify credentials
  const user = await db.client.client.user.findUnique({
    where: { email },
  });
  if (!user) {
    return utils.handlers.error(res, "authentication", {
      message: "user doesn't exist",
    });
  }

  // verify password
  const match = await utils.passwords.verify(user.password, password);
  if (!match) {
    return utils.handlers.error(res, "authentication", {
      message: "wrong password",
    });
  }
  // auth success: generate tokens for user
  try {
    const aT = utils.tokens.generate.accessToken({ id: user.id });
    const rT = utils.tokens.generate.refreshToken({ id: user.id });

    // cache keys and handle failure
		const cacheAT = await utils.cache.set(aT, user.id);
		const cacheRT = await utils.cache.set(`${aT}:Refresh`, usre.id);
		if (!cacheAT || !cacheRT){
			return utils.handlers.error(res, "authentication", {
				message: "login failed",
				status: 500,
			});
		}
    // Filter out hidden fields
    filtered = await db.client.filterModels([user]);
    filtered[0].accessToken = aT;

    // return user profile
    return utils.handlers.success(res, {
      message: "login successful",
      data: filtered,
    });
  } catch (err) {
    return utils.handlers.error(res, "authentication", {
      message: "auth failed",
    });
  }
};

export default login;
