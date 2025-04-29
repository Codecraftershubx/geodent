import { Request, Response } from "express";
import type { TPayload, TUserModel } from "../../../../utils/types.js";
import config from "../../../../config.js";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const login = async (req: Request, res: Response): Promise<void> => {
  // extract access token

  const authHeader = req.headers.authorization;
  let filtered;
  if (authHeader) {
    const [_, accessToken] = authHeader.split(" ");
    try {
      let data = utils.tokens.decompose.accessToken(accessToken);
      if (data.expired) {
        return utils.handlers.error(res, "authentication", {
          message: "access token expired",
        });
      }
      // login authenticated User
      const payload = data.payload as TPayload;
      // get user profile
      const user = await db.client.client.user.findUnique({
        where: { id: payload.id },
        include: db.client.include.user,
      });

      if (!user) {
        return utils.handlers.error(res, "authentication", {
          message: "unknown user",
        });
      }

      // filter hidden values
      filtered = await db.client.filterModels([user]);
      return utils.handlers.success(res, {
        data: filtered,
        message: "auth success",
      });
    } catch (err) {
      // error occured while generating token
      if (err instanceof Error) {
        return utils.handlers.error(res, "general", {
          message: "auth failed",
          status: 500,
          data: [{ details: err }],
        });
      }
      // invalid access token
      return utils.handlers.error(res, "authentication", {
        message: "user doesn't exist",
      });
    }
  }

  // no auth header: use user credentials
  const { email, password } = req.body;
  if (!email || !password) {
    const field = email
      ? "password"
      : password
        ? "email"
        : "email and password";
    return utils.handlers.error(res, "authentication", {
      message: `${field} not provided`,
    });
  }
  // verify credentials
  const user = await db.client.client.user.findUnique({
    where: { email },
  });
  if (!user) {
    return utils.handlers.error(res, "authentication", {
      message: "user doesn't exist",
    });
  }

  // verify password
  const match = await utils.passwords.verify(user.password, password);
  if (!match) {
    return utils.handlers.error(res, "authentication", {
      message: "wrong password",
    });
  }
  // auth success: generate tokens for user
  try {
    const newAccessToken = utils.tokens.generate.accessToken({ id: user.id });
    const newRefreshToken = utils.tokens.generate.refreshToken({ id: user.id });
    const updatedUser = await db.client.client.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
      include: db.client.include.user,
    });

    // filter out fields to hide
    filtered = await db.client.filterModels([updatedUser]);
    filtered[0].accessToken = newAccessToken;

    // set cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: config.refreshMaxAge,
      secure: config.mode === "LIVE",
      path: "/api/v1",
    });

    // return user profile
    return utils.handlers.success(res, {
      message: "user authenticated",
      data: filtered,
    });
  } catch (err) {
    return utils.handlers.error(res, "authentication", {
      message: "auth failed",
    });
  }
};

export default login;
