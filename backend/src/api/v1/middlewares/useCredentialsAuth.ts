import { Request, Response, NextFunction } from "express";
import db from "../../../db/utils/index.js";
import utils from "../../../utils/index.js";

const validateTokenPayload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.auth.strictMode) {
    console.log("Backend: Using credentials");
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      const field = email
        ? "password"
        : password
          ? "email"
          : "email and password";
      console.log("returning missing credential");
      return utils.handlers.error(req, res, "authentication", {
        message: `${field} not provided`,
      });
    }
    // verify credentials
    const user = await db.client.client.user.findUnique({
      where: { email },
    });
    if (!user) {
      return utils.handlers.error(req, res, "authentication", {
        message: "Unauthorised: user doesn't exist",
      });
    }
    // verify password
    const match = await utils.passwords.verify(user.password, password);
    if (!match) {
      console.log("returning wrong password");
      return utils.handlers.error(req, res, "authentication", {
        message: "wrong password",
      });
    }
    const filtered = await db.client.filterModels([user]);
    req.body.auth.user = filtered;
  }
  next();
};

export default validateTokenPayload;
