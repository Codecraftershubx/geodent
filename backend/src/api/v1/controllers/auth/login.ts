import { Request, Response } from "express";
import utils from "../../../../utils/index.js";
import config from "../../../../config.js";
import type { TJwtPayload, TokenTimesType } from "../../../../utils/types.js";

const login = async (req: Request, res: Response): Promise<void> => {
  // extract access token
  const authHeader = req.headers.authorization;
  // validate middleware validation happened
  const { user } = req.body.auth;
  const payload: TJwtPayload = req.body.auth.payload;
  let aTimes: TokenTimesType;
  let aT: string;
  if (!user) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  // use auth token if provided
  try {
    if (authHeader) {
      aT = authHeader.split(" ")[1];
      // verify user not already logged in
      const cacheGetRes = await utils.cache.hget(user.id, "data");
      console.log("LOGIN: cacheGetRes:", cacheGetRes);
      if (cacheGetRes.value !== null) {
        return utils.handlers.error(req, res, "authentication", { errno: 10 });
      }
      aTimes = { iat: payload.iat, exp: payload.exp };
      console.log(
        "user not ALREADY LOGGED IN...proceeding to login: aTimes:",
        aTimes
      );
    } else {
      // generate new access token for user authenticated with credentials - email + password
      aTimes = utils.getTokenTimes("accessToken");
      aT = await utils.tokens.generate.accessToken({ id: user.id, ...aTimes });
    }
    const cacheATRes = await utils.cache.hset(
      user.id,
      {
        [config.aTFieldName]: aT,
        data: JSON.stringify(user),
      },
      { EXAT: aTimes.exp }
    );
    // start new session if it's a new auth. skip otherwise
    const oldSession = await utils.cache.get(`${aT}:${config.rTFieldName}`);
    console.log("old session:", oldSession);
    if (oldSession.value === null) {
      // generate refreshToken and cache results
      const rTimes = utils.getTokenTimes("refreshToken", aTimes.iat);
      const rT: string = await utils.tokens.generate.refreshToken({
        id: user.id,
        ...rTimes,
      });
      const cacheRTRes = await utils.cache.set(
        `${aT}:${config.rTFieldName}`,
        rT,
        { EXAT: rTimes.exp }
      );
      // handle new session caching errors
      if (!cacheRTRes.success) {
        utils.cache.delete(`${aT}:${config.rTFieldName}`, user.id);
        throw new Error("Login failed");
      }
    }
    if (!cacheATRes.success) {
      utils.cache.delete(`${aT}:${config.rTFieldName}`, user.id);
      throw new Error("Login failed");
    }
    return utils.handlers.success(req, res, {
      data: [{ accessToken: aT }],
    });
  } catch (err: any) {
    // error occured while fetching data from cache
    console.error("[LOGOUT]:", err);
    return utils.handlers.error(req, res, "general", {
      message: err?.message ?? "Internal server error",
      status: 500,
      data: [{ details: err }],
    });
  }
};

export default login;
