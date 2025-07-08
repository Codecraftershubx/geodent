import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const profile = async (req: Request, res: Response): Promise<void> => {
  // validate user is loggedIn
  const { profile, isLoggedIn, user } = req.body.auth;
  if (!isLoggedIn || !profile) {
    return utils.handlers.error(req, res, "authentication", {
      message: "Unauthorised!",
    });
  }
	if (!profile.id === user.id) {
		return utils.handlers.error(req, res, "authentication", {
      message: "Unauthorised! unknown user!",
    });
	}
	return utils.handlers.success(req, res, {
		message: "success",
		data: [profile],
	});
};

export default profile;
