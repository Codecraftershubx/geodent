import { Request, Response, NextFunction } from "express";
import utils from "../../../utils/index.js";
import type { TErrorNumberType } from "../../../config.js";

const validateIsLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user: aTData } = req.body.auth;
  if (!aTData) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  // validate use is logged in
  const cachedData = await utils.cache.hget(aTData.id, "data");
  //console.log("cachedData [VALIDATEISLOGGEDIN]", cachedData);
  if (!cachedData.value) {
    return utils.handlers.error(req, res, "authentication", { errno: 7 });
  }
  if (!cachedData.success) {
    return utils.handlers.error(req, res, "general", {
      status: 500,
      data: [{ details: { errorMessage: cachedData.message } }],
    });
  }
  // since cachedData is successful, we expect its value to be an object {}
  // so set it as user's profile
  try {
    const userData = cachedData.value as string;
    //console.log("userData", userData);
    req.body.auth.profile = JSON.parse(userData);
    req.body.auth.isLoggedIn = true;
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(req, res, "general", {
      data: [{ details: err }],
    });
  }
  next();
};

export default validateIsLoggedIn;
