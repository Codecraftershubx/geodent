import { Request, Response } from "express";
import utils from "../../../../utils/index.js";
import config from "../../../../config.js";

const logout = async (req: Request, res: Response): Promise<void> => {
  console.log("LOGOUT CALLED...");
  // get auth token from request
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return utils.handlers.error(req, res, "authentication", {
      message: "Unauthorised!",
    });
  }
  const [_, accessToken] = authHeader.split(" ");
  if (!accessToken) {
    return utils.handlers.error(req, res, "authentication", {
      message: "Unauthorised!",
    });
  }
  try {
    // verify user is logged in
    const cachedData = (await utils.cache.get(accessToken)) as string;
    console.log("    => cachedUser [cache]", cachedData);
    if (!cachedData) {
      return utils.handlers.error(req, res, "authentication", {
        message: "Unauthorised: user not logged in",
      });
    }
    // get validated user
    const { user: aTData } = req.body.auth;
    const cachedUser = JSON.parse(cachedData);
    if (!aTData) {
      return utils.handlers.error(req, res, "authentication", {
        message: "Unauthorised! Bad request",
      });
    }
    console.log("    => parsed cachedUser data:", cachedUser);
    console.log("    => user from auth obj:", aTData);
    if (aTData.id !== cachedUser?.id) {
      console.log("aTData != cachedUserId: ", aTData.id, cachedUser);
      return utils.handlers.error(req, res, "authentication", {
        message: "Unauthorised: unknown user",
      });
    }
    // clear tokens from cache
    await utils.cache.delete(
      accessToken,
      `${accessToken}${config.refreshCacheSuffix}`
    );
    return utils.handlers.success(req, res, {
      message: "Logout success",
    });
  } catch (err) {
    // error deleting from db
    console.error(err);
    return utils.handlers.error(req, res, "general", {
      message: "Error: logout failed",
      data: [{ details: err }],
    });
  }
};

export default logout;
