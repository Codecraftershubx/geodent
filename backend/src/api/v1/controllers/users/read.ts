import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }
  // get one city by id
  const { id } = req.params;
  const { includes } = matchedData(req);
  const fields = includes ? includes : [];
  const include = includes ? {} : db.client.include.user;
  for (let field of fields) {
    Object.assign(include, { [field]: true });
  }
  let count;
  if (id) {
    const user = await db.client.client.user.findMany({
      where: { id, isDeleted: false },
      include,
      omit: db.client.omit.user,
    });
    count = user.length;
    if (count) {
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: await db.client.filterModels(user),
        count,
      });
    }
    return utils.handlers.error(req, res, "general", {
      message: `user not found`,
      status: 404,
    });
  }
  // get all cities
  const users = await db.client.client.user.findMany({
    where: { isDeleted: false },
    include,
    omit: db.client.omit.user,
  });

  count = users.length;
  if (count) {
    return utils.handlers.success(req, res, {
      message: "query success",
      data: await db.client.filterModels(users),
      count,
    });
  }
  return utils.handlers.error(req, res, "general", {
    message: "no users created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
