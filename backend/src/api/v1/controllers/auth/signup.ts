import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import { matchedData, validationResult } from "express-validator";
import utils from "../../../../utils/index.js";
import config from "../../../../config.js";
import type { THandlerOptions, TUserData } from "../../../../utils/types.js";

const createNewUser = async (req: Request, res: Response): Promise<void> => {
  // validate sent data
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  // get data and create user
  const data: TUserData = matchedData(req).data;
  try {
    // verify user with email doesn't exist
    const existingUser = await db.client.client.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existingUser) {
      return utils.handlers.error(res, "validation", {
        message: `email ${data.email} already in use`,
      });
    }

    // generate password hash
    const password = await utils.passwords.hash(data.password);
    if (!password) {
      return utils.handlers.error(res, "general", {
        message: "Sorry, some error occured. Try again later.",
      });
    }

    try {
      // generate createUser and updateUser transactions
      let accessToken;
      const [, updateUserTx] = await db.client.client.$transaction(
        async (_) => {
          const newUser = await db.client.client.user.create({
            data: {
              ...data,
              password,
            },
          });
          accessToken = utils.tokens.generate.accessToken({ id: newUser.id });
          const refreshToken = utils.tokens.generate.refreshToken({
            id: newUser.id,
          });
          const updatedUser = await db.client.client.user.update({
            data: { refreshToken },
            where: { id: newUser.id },
          });
          return [newUser, updatedUser];
        },
      );
      // set refreshToken cookie
      res.cookie("refreshToken", updateUserTx.refreshToken, {
        httpOnly: true,
        maxAge: config.refreshMaxAge,
        secure: config.mode === "LIVE",
        path: "/api/v1",
      });
      // return success
      return utils.handlers.success(res, {
        data: [
          {
            id: updateUserTx.id,
            accessToken,
            refreshToken: updateUserTx.refreshToken,
          },
        ],
        status: 201,
        message: "user created successfully",
      });
    } catch (err: any) {
      utils.handlers.error(res, "authentication", {
        message: err?.message ?? "user creation failed",
        data: [{ details: err.toString() }],
        code: 500,
      });
    }
  } catch (err: any) {
    const resOptions: THandlerOptions = {
      data: [{ details: err?.message ?? err.toString() }],
      message: "user creation failed",
    };
    if (err?.code || null === "P2002") {
      resOptions["status"] = 400;
    }
    return utils.handlers.error(res, "general", resOptions);
  }
};

export default createNewUser;
