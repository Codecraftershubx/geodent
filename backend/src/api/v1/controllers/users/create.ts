import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import { matchedData, validationResult } from "express-validator";
import utils from "../../../../utils/index.js";
import type { THandlerOptions } from "../../../../utils/types.js";

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
  const { data } = matchedData(req);

  try {
    const password = await utils.password.hash(data.password);
    if (!password) {
      utils.handlers.error(res, "general", {
        message: "Sorry, some error occured. Try again later.",
      });
    }

    const newUser = await db.client.client.user.create({
      data: {
        ...data,
        password,
      },
    });

    return utils.handlers.success(res, {
      data: [{ id: newUser.id, email: newUser.email }],
      message: "user created successfully",
      status: 201,
    });
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
