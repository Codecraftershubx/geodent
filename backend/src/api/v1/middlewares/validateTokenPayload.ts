import { Request, Response, NextFunction } from "express";
import db from "../../../db/utils/index.js";
import utils from "../../../utils/index.js";

const validateTokenPayload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { payload: aTData } = req.body.auth;
  //console.log("VALIDATE TOKEN PAYLOAD", aTData);
  if (aTData) {
    try {
      // get user profile
      const user = await db.client.client.user.findUnique({
        where: { id: aTData.id, isDeleted: false },
        include: db.client.include.user,
      });
      //console.log("\tUSER PROFILE:", user);
      if (!user || user.id !== aTData.id) {
        console.log("no user found");
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
      return utils.handlers.error(
        req,
        res,
        req.headers.authorization ? "authentication" : "validation",
        { errno: req.headers?.authorization ? 2 : 21 }
      );
    }
    next();
  }
};

export default validateTokenPayload;
