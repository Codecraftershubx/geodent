import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import type { TPayload, TUserModel } from "../../../../utils/types.js";
import config from "../../../../config.js";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
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

  const data = matchedData(req);
  res.json(data);
  return;
};

export default create;
