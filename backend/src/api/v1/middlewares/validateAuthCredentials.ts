import { Request, Response, NextFunction } from "express";
import db from "../../../db/utils/index.js";
import utils from "../../../utils/index.js";

const validateAuthCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[VERIFY AUTH CREDENTIALS]");
  if (req.body.auth.strictMode) {
    console.log("\tFAILED: CREDENTIALS USE NOT ALLOWED");
    return utils.handlers.error(req, res, "authentication", {});
  }
  if (req.headers.authorization) {
    next();
  } else {
    const { email, password } = req.body;
    if (!email || !password) {
      const field = email
        ? "password"
        : password
          ? "email"
          : "email and password";
      return utils.handlers.error(req, res, "authentication", {
        message: `${field} not provided`,
        errno: 15,
      });
    }
    // verify credentials
    try {
      const user = await db.client.client.user.findUnique({
        where: { email },
      });
      if (!user) {
        return utils.handlers.error(req, res, "authentication", { errno: 16 });
      }
      // verify password
      const match = await utils.passwords.verify(user.password, password);
      if (!match) {
        return utils.handlers.error(req, res, "authentication", { errno: 17 });
      }
      const filtered = await db.client.filterModels([user]);
      req.body.auth.user = filtered[0];
      console.log("\tSUCCESS");
      next();
    } catch (err: any) {
      return utils.handlers.error(req, res, "authentication", {});
    }
  }
};

export default validateAuthCredentials;
