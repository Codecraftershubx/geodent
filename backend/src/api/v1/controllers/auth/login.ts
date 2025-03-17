import { Request, Response } from "express";
import type { TPayload, TUserModel } from "../../../../utils/types.js";
import config from "../../../../config.js";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const login = async (req: Request, res: Response): Promise<void> => {
  // extract access token
  res.send({ message: "under maintenance" });
  return;
  /*
  let authHeader = req.headers.authorization;
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
      const userModel: TUserModel = (await db.client.client.user.findFirst({
        where: { id: payload.id },
        include: db.client.modelFilters.users.select,
      })) as TUserModel;
      // filter hidden values
      const userProfile = getUserProfile(userModel);
      return utils.handlers.success(res, {
        data: [userProfile],
        message: "user authenticated",
      });
    } catch (err) {
      // error occured while generating token
      if (err instanceof Error) {
        return utils.handlers.error(res, "general", {
          message: "user authentication failed",
          status: 500,
          data: [{ details: err }],
        });
      }
      // invalid access token
      return utils.handlers.error(res, "authentication", {
        message: "invalid credentials provided",
      });
    }
  }
  // no auth header: use user credentials
  const { email, password } = req.body;
  if (!email || !password) {
    return utils.handlers.error(res, "authentication", {
      message: "missing email or password",
    });
  }
  // verify credentials
  const user = await db.client.client.user.findUnique({
    where: { email },
  });
  if (!user) {
    return utils.handlers.error(res, "authentication", {
      message: "invalid credentials provided",
    });
  }

  // verify password
  const match = await utils.passwords.verify(user.password, password);
  if (!match) {
    return utils.handlers.error(res, "authentication", {
      message: "invalid credentials provided",
    });
  }
  // auth success: generate tokens for user
  try {
    const newAccessToken = utils.tokens.generate.accessToken({ id: user.id });
    const newRefreshToken = utils.tokens.generate.refreshToken({ id: user.id });
    const updatedUser: TUserModel = await db.client.client.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
      include: db.client.modelFilters.users.include,
    });

    // filter out fields to hide
    const filteredUser = getUserProfile(updatedUser);
    filteredUser.accessToken = newAccessToken;

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
      data: [filteredUser],
    });
  } catch (err) {}
  */
};

export default login;
