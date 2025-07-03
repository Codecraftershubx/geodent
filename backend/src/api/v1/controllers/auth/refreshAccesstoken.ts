import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import config from "../../../../config.js";

const refresh = async (req: Request, res: Response): Promise<void> => {
	// validate access token sent
	const authHeader = req.headers.authorization;
  if (!authHeader) {
    return utils.handlers.error(res, "authentication", {
      message: "Unauthorised!",
    });
  }
	// extract token
  const [_, accessToken] = req.headers.authorization.split(" ");
  if (!accessToken) {
    return utils.handlers.error(res, "authentication", {
      message: "Unauthorised!",
    });
  }
	try {
		// validate token's expired
		const { payload as aTData } = utils.tokens.decompose.accessToken(accessToken);
		if (aTData !== null) {
      return utils.handlers.error(res, "authentication", {
        message: "Unauthorised: session still active",
      });
    }
		// verify refreshToken in cache and not expired
		const rT = (await utils.cache.get(`${accessToken}${config.refreshCacheSuffix}`)) as string;
		if (!rT) {
			return utils.handlers.error(res, "authentication", {
        message: "Unauthorised: tokens expired",
      });
		}
		// verify both token payloads match
    const { payload as rTData } = utils.tokens.decompose.refreshToken(rT);
		if (rTData.id !== aTData.id) {
			return utils.handlers.error(res, "authentication", {
        message: "Unauthorised: unknown user",
      });
		}
    // validate user exists and owns the tokens
    const user = await db.client.client.user.findUnique({
      	where: { id: rTData.id },
    });
		try {
    if (!user) {
      return utils.handlers.error(res, "authentication", {
        message: "Unauthorized: user not found",
      });
    }
    if (user.id !== rTData.id) {
			return utils.handlers.error(res, "authentication", {
				message: "Unauthorized: unknown user",
			});
		}
		// generate new access token and return
		const newToken: string = utils.tokens.generate.accessToken({ id: user.id });
    return utils.handlers.success(res, {
        message: "Refresh success",
        data: [{ accessToken: newToken }],
    });
    } catch (err: any) {
      // handle unique db constraint error
      return utils.handlers.error(res, "general", {
        message: "Error: unable to complete operation",
        data: [{ details: err }],
      });
    }
  } catch (_) {
    return utils.handlers.error(res, "authentication", {
      message: "Unauthorised: invalid token",
    });
  }
};

export default refresh;
