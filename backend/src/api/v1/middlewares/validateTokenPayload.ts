import { Request, Response, NextFunction } from "express";
import db from "../../../db/utils/index.js";
import utils from "../../../utils/index.js";

const validateTokenPayload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { payload: aTData } = req.body.auth;
  if (aTData) {
    try {
      // get user profile
      const user = await db.client.client.user.findUnique({
        where: { id: aTData.id, isDeleted: false },
        include: db.client.include.user,
      });
      if (!user || user.id !== aTData.id) {
        return utils.handlers.error(req, res, "authentication", { errno: 6 });
      }
      const filtered = await db.client.filterModels([user]);
      req.body.auth.user = filtered[0];
      next();
    } catch (err: any) {
      console.error("[VALIDATETOKENPAYLOAD]:", err);
      return utils.handlers.error(req, res, "general", {
        status: 500,
        data: [{ details: err }],
      });
    }
  } else {
    if (req.body.auth.strictMode) {
      return utils.handlers.error(req, res, "authentication", { errno: 3 });
    }
    next();
  }
};

export default validateTokenPayload;
