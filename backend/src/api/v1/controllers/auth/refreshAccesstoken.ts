import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import config from "../../../../config.js";

const refresh = async (req: Request, res: Response): Promise<void> => {
  // validate access token sent
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return utils.handlers.error(req, res, "authentication", { errno: 3 });
  }
  // extract token
  const [title, aT] = authHeader.split(" ");
  if (!aT || title !== "Bearer") {
    return utils.handlers.error(req, res, "authentication", { errno: 4 });
  }

  try {
    // validate token's expired
    const { payload: aTData } = utils.tokens.decompose.accessToken(aT);
    if (aTData !== null) {
      return utils.handlers.error(req, res, "authentication", { errno: 8 });
    }
    // fetch refresh token from cache
    const rTRes = await utils.cache.get(`${aT}:${config.rTFieldName}`);
    if (!rTRes.success) {
      return utils.handlers.error(req, res, "authentication", { errno: 7 });
    }
    // verify refresh token not expired
    const { payload: rTData } = utils.tokens.decompose.refreshToken(
      rTRes.value
    );
    if (!rTData) {
      return utils.handlers.error(req, res, "authentication", { errno: 9 });
    }
    // validate user exists and owns the refresh token
    try {
      const user = await db.client.client.user.findUnique({
        where: { id: rTData.id, isDeleted: false },
      });
      if (!user) {
        return utils.handlers.error(req, res, "authentication", { errno: 6 });
      }
      if (user.id !== rTData.id) {
        return utils.handlers.error(req, res, "authentication", {});
      }
      const filtered = await db.client.filterModels([user]);
      // generate new auth token and delete old refresh token from cache
      const aTimes = utils.getTokenTimes("accessToken");
      const newAT: string = utils.tokens.generate.accessToken({
        id: user.id,
        ...aTimes,
      });
      const delOldTokens = await utils.cache.delete(
        rTData.id,
        `${aT}:${config.rTFieldName}`
      );
      // handle caching failure
      if (!delOldTokens.success) {
        return utils.handlers.error(req, res, "general", { status: 500 });
      }
      return utils.handlers.success(req, res, {
        message: "Refresh success",
        data: [{ accessToken: newAT }],
      });
    } catch (err: any) {
      // handle unique db constraint error
      return utils.handlers.error(req, res, "general", {
        data: [{ details: err }],
      });
    }
  } catch (_) {
    return utils.handlers.error(req, res, "authentication", { errno: 6 });
  }
};

export default refresh;
