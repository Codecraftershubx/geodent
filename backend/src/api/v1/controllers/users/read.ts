import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one city by id
  const { id } = req.params;
  let count;
  if (id) {
    const user = await db.client.client.user.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.user,
      omit: db.client.omit.user,
    });
    count = user.length;
    if (count) {
      return utils.handlers.success(res, {
        message: "query successful",
        data: await db.client.filterModels(user),
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `user not found`,
      status: 404,
    });
  }
  // get all cities
  const users = await db.client.client.user.findMany({
    where: { isDeleted: false },
    include: db.client.include.user,
    omit: db.client.omit.user,
  });

  count = users.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: await db.client.filterModels(users),
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no users created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
