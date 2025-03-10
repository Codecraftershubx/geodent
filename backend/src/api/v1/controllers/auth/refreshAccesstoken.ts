import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const refresh = async (req: Request, res: Response): Promise<void> => {
  // extract refresh token
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return utils.handlers.error(res, "validation", {
      message: "refresh token required",
    });
  }
  // verify refreshToken is not expired
  try {
    const { payload } = utils.tokens.decompose.refreshToken(refreshToken);
    if (!payload) {
      return utils.handlers.error(res, "authentication", {
        message: "refresh token expired",
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
          message: "invalid refresh token",
        });
      }

      // refresh access token and return
      const newToken = utils.tokens.generate.accessToken({
        id: user.id,
      });
      return utils.handlers.success(res, {
        message: "access token refreshed",
        data: [{ id: user.id, accessToken: newToken }],
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
