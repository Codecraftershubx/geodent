import { Request, Response } from "express";
import utils from "../../../../utils/index.js";
import config from "../../../../config.js";

const login = async (req: Request, res: Response): Promise<void> => {
  // extract access token
  const authHeader = req.headers.authorization;
  // validate middleware validation happened
  const { user } = req.body.auth;
  let aT: string;
  if (!user) {
    return utils.handlers.error(req, res, "authentication", {
      message: "Unauthorised!",
      status: 403,
    });
  }
  // use auth token if provided
  try {
    if (authHeader) {
      aT = authHeader.split(" ")[1];
      // verify user not already logged in
      const cacheGetRes = await utils.cache.hgetall(user.id);
      if (cacheGetRes.success) {
        return utils.handlers.success(req, res, {
          message: "already loggedd in",
        });
      }
    } else {
      // generate new access token for user authenticated with credentials - email + password
      aT = await utils.tokens.generate.accessToken({ id: user.id });
    }
    // generate refreshToken and cache results
    const rT: string = await utils.tokens.generate.refreshToken({
      id: user.id,
    });
    const cacheATRes = await utils.cache.hset(
      user.id,
      {
        [config.aTFieldName]: aT,
        data: JSON.stringify(user),
      },
      config.expirations.accessToken
    );
    const cacheRTRes = await utils.cache.set(
      `${aT}:${config.rTFieldName}`,
      rT,
      config.expirations.refreshToken
    );
    if (!cacheATRes.success || !cacheRTRes.success) {
      throw new Error("Error! Login failed");
    }
    return utils.handlers.success(req, res, {
      data: [{ accessToken: aT }],
      message: "login success",
    });
  } catch (err: any) {
    // error occured while fetching data from cache
    return utils.handlers.error(req, res, "general", {
      message: err?.message ?? "Error: An internal error occured",
      status: 500,
      data: [{ details: err }],
    });
  }
};

export default login;
