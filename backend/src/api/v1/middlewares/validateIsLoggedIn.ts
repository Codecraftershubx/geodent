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
  if (!cachedData.success) {
    const status = cachedData?.message === "Error! Cache not ready" ? 500 : 401;
    const errData: Record<string, any> = { status };
    let errType: TErrorNumberType;
    if (status === 401) {
      errType = "authentication";
      errData.errno = 7;
    } else {
      errType = "general";
    }
    errData.data = [{ details: { errorMessage: cachedData.message } }];
    return utils.handlers.error(req, res, errType, errData);
  }
  // since cachedData is successful, we expect its value to be an object {}
  // so set it as user's profile
  try {
    const userData = cachedData.value as string;
    console.log("userData", userData);
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
