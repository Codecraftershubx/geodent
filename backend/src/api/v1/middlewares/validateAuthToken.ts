import { Request, Response, NextFunction } from "express";
import type {
  TAccessTokenPayload,
  TDecomposeResult,
} from "../../../../utils/types.js";
import utils from "../../../../utils/index.js";
import config from "../../../../config.js";

const validateAuthToken = async (_: Request, res: Response, next: NextFunction) => {
	// validate headers sent
	const authHeader = req.headers.authorization;
	if (authHeader) {
		// validate header in right format and in header
		const [_, aT] = authHeader.split(" ");
		if (!aT) {
			return utils.handlers.error(res, "authentication", {
				message: "Unauthorised! Bad headers",
				status: 403,
			});
		}
		try {
			// validate token's not expired
			let { payload: aTData } = utils.tokens.decompose.accessToken(accessToken);
			if (aTData === null) {
				return utils.handlers.error(res, "authentication", {
					message: "Unauthorised: session expired",
				});
			}
			next();
		} catch (err: any) {
			return utils.handlers.error(res, "general", {
				message: "Some error occured",
				status: 500,
				data: [{ details: err }],
			});
		}
	} else {
		if (req?.protected ?? true;) {
			return utils.handlers.error(res, "authentication", {
				message: "Unauthorised!",
				status: 403,
			});
		}
		next();
	}
}