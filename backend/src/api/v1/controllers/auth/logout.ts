import { Request, Response } from "express";
import utils from "../../../../utils/index.js";
import config from "../../../../config.js";

const logout = async (req: Request, res: Response): Promise<void> => {
  // get auth token from request
  const { user: aTData } = req.body.auth;
  if (!aTData) {
    return utils.handlers.error(req, res, "authentication", {
      message: "Unauthorised!",
    });
  }
  try {
    // verify authed user is logged in
    const cachedData = await utils.cache.hgetall(aTData.id);
    if (!cachedData.success) {
      const status =
        cachedData?.message === "Error! Cache not ready" ? 500 : 401;
      const message =
        cachedData?.message === "Error! Cache not ready"
          ? cachedData.message
          : "Unauthorised! Not loggedin";
      return utils.handlers.error(req, res, "authentication", {
        message,
        status,
      });
    }

    // get validated user
    const cachedUser = JSON.parse(cachedData.value.data);
    if (aTData.id !== cachedUser?.id) {
      //console.log("aTData != cachedUserId: ", aTData.id, cachedUser);
      return utils.handlers.error(req, res, "authentication", {
        message: "Unauthorised: unknown user",
      });
    }
    // clear tokens from cache
    await utils.cache.delete(aTData.id, `${aTData.id}:${config.rTFieldName}`);
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
