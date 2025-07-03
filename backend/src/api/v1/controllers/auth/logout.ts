import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const logout = async (req: Request, res: Response): Promise<void> => {
  // get auth token from request
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return utils.handlers.error(res, "authentication", {
			message: "Unauthorised!",
		});
	}
	const [_, accessToken ] = authHeader.split(" ");
	if (!accessToken) {
		return utils.handlers.error(res, "authentication", {
			message: "Unauthorised!",
		})
	}
	try {
		// verify user is logged in
		const cachedUserId = await utils.cache.get(accessToken);
		if (!cachedUserId) {
			return utils.handlers.error(res, "authentication", {
				message: "Unauthorised: user not logged in",
			})
		}
		// extract user id from token and
		const { payload as aTData } = utils.tokens.decompose.accessToken(accessToken);
		if (aTData === null) {
			return utils.errors.error(res, "authentication", {
				message: "Unauthorised: session expired",
			});
		}
		// validate payload id matches cached user id
		if (aTData.id !== cachedUserId) {
			return utils.handlers.error(res, "authentication", {
				message: "Unauthorised: unknown user",
			});
		}
		// clear tokens from cache
		const clearSuccess = await utils.cache.delete(accessToken, `${accessToken}${config.refreshCacheSuffix}`);
		if (!clearSuccess) {
			return utils.handlers.error(res, "general", {
				message: "Error: logout failed",
				code: 500,
			});
		}

    return utils.handlers.success(res, {
      message: "Logout success",
    });
  } catch (err) {
    // error deleting from db
    console.error(err);
    return utils.handlers.error(res, "general", {
      message: "Error: logout failed",
      data: [{ details: err }],
    });
  }
};

export default logout;
