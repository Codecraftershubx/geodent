import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const refresh = async (req: Request, res: Response): Promise<void> => {
  if (!req?.headers?.authorization) {
    return utils.handlers.error(res, "authentication", {
      message: "Unauthorized: Access token required",
    });
  }

  const [_, accessToken] = req.headers.authorization.split(" ");
  if (!accessToken) {
    return utils.handlers.error(res, "authentication", {
      message: "Unauthorized: Access token required",
    });
  }

  // extract refresh token
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return utils.handlers.error(res, "authentication", {
      message: "Unauthorized: Refresh token required",
    });
  }

  // verify refreshToken is not expired
  try {
    const { payload } = utils.tokens.decompose.refreshToken(refreshToken);
    const accessData = utils.tokens.decompose.accessToken(accessToken);

    if (!accessData.expired) {
      return utils.handlers.error(res, "authentication", {
        message: "Unauthorized: Access token not expired",
      });
    }

    if (!payload) {
      return utils.handlers.error(res, "authentication", {
        message: "Unauthorized: Refresh token expired",
      });
    }

    // validate user owns refresh token
    try {
      const user = await db.client.client.user.findUnique({
        where: { id: payload.id },
      });

      // no user found or refresh tokens don't match
      if (!user || user.refreshToken !== refreshToken) {
        return utils.handlers.error(res, "authentication", {
          message: "Unauthorized: Invalid refresh token",
        });
      }

      // refresh access token and return
      const newToken = utils.tokens.generate.accessToken({
        id: user.id,
        refreshToken,
      });
      return utils.handlers.success(res, {
        message: "Token refreshed",
        data: [{ accessToken: newToken }],
      });
    } catch (err: any) {
      // handle unique db constraint error
      return utils.handlers.error(res, "general", {
        message: "unable to complete operation",
        data: [{ details: err }],
      });
    }
  } catch (_) {
    return utils.handlers.error(res, "authentication", {
      message: "invalid refresh token provided",
    });
  }
};
export default refresh;
