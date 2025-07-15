import { Request, Response, NextFunction } from "express";
import config from "../../../config.js";
import utils from "../../../utils/index.js";

const deleteOldSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[DELETING OLD SESSIONS]");
  if (req.body.auth.strictMode) {
    console.log("\tFAILED: CREDENTIALS USE NOT ALLOWED");
    return utils.handlers.error(req, res, "authentication", {});
  }
  // verify credentials
  const { user }: { user: { id: string; [key: string]: any } | undefined } =
    req.body.auth;
  if (!user) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  try {
    // delete old session
    const aT = await utils.cache.hget(user.id, config.aTFieldName);
    if (aT.value) {
      console.log("\tSESSION FOUND for", aT.value);
      await utils.cache.delete(`${aT.value}:${config.rTFieldName}`, user.id);
    }
    console.log("\tSUCCESS");
    next();
  } catch (err: any) {
    return utils.handlers.error(req, res, "general", {});
  }
};

export default deleteOldSessions;
