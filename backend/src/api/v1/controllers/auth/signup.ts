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
    return utils.handlers.error(req, res, "validation", {
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
      return utils.handlers.error(req, res, "validation", {
        message: `email ${data.email} not available`,
      });
    }

    // generate password hash
    const password = await utils.passwords.hash(data.password);
    if (!password) {
      return utils.handlers.error(req, res, "general", {
        message: "Sorry, some error occured. Try again later.",
      });
    }

    try {
      // generate createUser and updateUser transactions
      const result = await db.client.client.$transaction(async () => {
        const user = await db.client.client.user.create({
          data: {
            ...data,
            password,
          },
        });
        const aT = utils.tokens.generate.accessToken({ id: user.id });
        console.log("accessToken:", aT);
        return [user, aT];
      });
      const newUser = result[0] as Record<string, any>;
      const accessToken = result[1] as string;
      // return success
      return utils.handlers.success(req, res, {
        data: [{ id: newUser.id, accessToken }],
        status: 201,
        message: "user created successfully",
      });
    } catch (err: any) {
      utils.handlers.error(req, res, "authentication", {
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
    return utils.handlers.error(req, res, "general", resOptions);
  }
};

export default createNewUser;
