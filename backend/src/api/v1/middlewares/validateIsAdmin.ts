import { Request, Response, NextFunction } from "express";
import utils from "../../../utils/index.js";

/**
 * Validates a user is an admin.
 * Expects requesting user to already be logged in.
 * @func validateIsAdmin
 * @param req Request object of @type {Express.Request}
 * @param res Response object of @type {Express.Response}
 * @param next Next middleware of @type {Express.NextFunction}
 * @returns {Promise<TRequestResData>} if user is not admin.
 * Otherwise, it passes control unto the next middleware
 */
const validateIsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user: aTData } = req.body.auth;
  if (!aTData) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  // validate user is admin
  if (!aTData.isAdmin) {
    console.log("User not admin");
    return utils.handlers.error(req, res, "authentication", {});
  }
  next();
};

export default validateIsAdmin;
