import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const logout = async (req: Request, res: Response): Promise<void> => {
  // extract refresh token
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return utils.handlers.error(res, "validation", {
      message: "refresh token required",
    });
  }

  // delete token from db
  try {
    await db.client.client.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null },
    });

    return utils.handlers.success(res, {
      message: "logout success",
    });
  } catch (err) {
    // error deleting from db
    console.error(err);
    return utils.handlers.error(res, "general", {
      message: "logout failed",
      data: [{ details: err }],
    });
  }
};

export default logout;
