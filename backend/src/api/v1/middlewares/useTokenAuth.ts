import { Request, Response, NextFunction } from "express";
import db from "../../../db/utils/index.js";
import utils from "../../../utils/index.js";

const validateTokenPayload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { payload: aTData } = req.body.auth.payload;
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
};

export default validateTokenPayload;
