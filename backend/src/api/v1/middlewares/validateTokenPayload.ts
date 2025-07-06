import { Request, Response, NextFunction } from "express";
import db from "../../../db/utils/index.js";
import utils from "../../../utils/index.js";

const validateTokenPayload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("VALIDATING TOKEN PAYLOAD");
  const { payload: aTData } = req.body.auth;
  if (aTData) {
    try {
      // get user profile
      const user = await db.client.client.user.findUnique({
        where: { id: aTData.id },
      });
      if (!user || user.id !== aTData.id) {
        return utils.handlers.error(req, res, "authentication", {
          message: "Unauthorised: unknown user",
        });
      }
      const filtered = await db.client.filterModels([user]);
      req.body.auth.user = filtered;
      next();
    } catch (err: any) {
      return utils.handlers.error(req, res, "general", {
        message: "Some error occured",
        status: 500,
        data: [{ details: err }],
      });
    }
  } else {
    if (req.body.auth.strictMode) {
      console.log("\tFAILED: NO AUTH PAYLOAD FOUND");
      return utils.handlers.error(req, res, "authentication", {
        message: "Unauthorised!",
        status: 403,
      });
    }
    console.log("\tPROCEEDING TO NEXT MIDDLEWARE");
    next();
  }
};

export default validateTokenPayload;
