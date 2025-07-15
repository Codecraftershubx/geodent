import { Request, Response, NextFunction } from "express";
import utils from "../../../utils/index.js";
import jwt from "jsonwebtoken";
import type { TDecomposeResult } from "../../../utils/types.js";

const validateAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validate headers sent
  const authHeader = req.headers.authorization;
  //console.log("authHeader:", authHeader);
  if (authHeader) {
    // validate header in right format and in header
    const [title, aT] = authHeader.split(" ");
    //console.log("TOKEN:", aT);
    if (!aT || title !== "Bearer") {
      return utils.handlers.error(req, res, "authentication", { errno: 4 });
    }
    try {
      // validate token's not expired
      let { payload: aTData }: TDecomposeResult =
        utils.tokens.decompose.accessToken(aT);
      if (aTData === null) {
        return utils.handlers.error(req, res, "authentication", { errno: 5 });
      }
      req.body.auth.payload = aTData;
      next();
    } catch (err: any) {
      console.error("[VALIDATEAUTHTOKEN]:", err);
      const isBadToken = err instanceof jwt.JsonWebTokenError;
      return utils.handlers.error(
        req,
        res,
        isBadToken ? "authentication" : "general",
        {
          status: isBadToken ? 401 : 500,
          errno: isBadToken ? 6 : 1,
          data: [{ details: err }],
        }
      );
    }
  } else {
    if (req.body.auth.strictMode) {
      return utils.handlers.error(req, res, "authentication", { errno: 3 });
    }
    next();
  }
};

export default validateAuthToken;
