import { Request, Response, NextFunction } from "express";
import utils from "../../../utils/index.js";
import config from "../../../config.js";

const validateIsLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user: aTData } = req.body.auth;
  if (!aTData) {
    return utils.handlers.error(req, res, "authentication", {
      message: "Unauthorised!",
    });
  }
  // validate use is logged in
  const cachedData = await utils.cache.hgetall(aTData.id);
  if (!cachedData.success) {
    const status = cachedData?.message === "Error! Cache not ready" ? 500 : 401;
    const message =
      cachedData.value === null
        ? "Not logged in"
        : cachedData?.message === "Error! Cache not ready"
          ? cachedData.message
          : "Unauthorised! Not loggedin";
    return utils.handlers.error(req, res, "authentication", {
      message,
      status,
    });
  }
  // since cachedData is successful, we expect its value to be an object {}
  // so set it as user's profile
  req.body.auth.profile = JSON.parse(cachedData.value as string).data;
  req.body.auth.isLoggedIn = true;
  next();
};

export default validateIsLoggedIn;
