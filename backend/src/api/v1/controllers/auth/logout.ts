import { Request, Response } from "express";
import utils from "../../../../utils/index.js";
import config from "../../../../config.js";

const logout = async (req: Request, res: Response): Promise<void> => {
  //console.log("LOGOUT");
  // get auth token from request
  const { user: aTData } = req.body.auth;
  if (!aTData) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  try {
    // verify authed user is logged in
    console.log("LOGOUT AUTH BODY: ", req.body.auth);
    if (!req.body.auth.isLoggedIn) {
      return utils.handlers.error(req, res, "authentication", { errno: 7 });
    }
    const aT = req.headers.authorization?.split(" ")[1];
    // validate authed user data vs cached user data
    const cachedUser = req.body.auth.profile;
    if (aTData.id !== cachedUser?.id) {
      return utils.handlers.error(req, res, "authentication", { errno: 6 });
    }
    // clear tokens from cache
    await utils.cache.delete(aTData.id, `${aT}:${config.rTFieldName}`);
    console.log("LOGOUT SUCCESS");
    return utils.handlers.success(req, res, {
      message: "Logout success",
    });
  } catch (err) {
    // error deleting from db
    console.error("[LOGOUT]:", err);
    return utils.handlers.error(req, res, "general", {
      message: "Logout failed for some reason",
      data: [{ details: err }],
    });
  }
};

export default logout;
