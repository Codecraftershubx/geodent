import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    // get like by id if exists
    const like = await db.client.client.like.findMany({
      where: { id },
      include: db.client.include.like,
    });
    count = like.length;
    if (count) {
      filtered = await db.client.filterModels(like);
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(req, res, "general", {
      message: `like not found`,
      status: 404,
    });
  }
  // get all likes
  const likes = await db.client.client.like.findMany({
    include: db.client.include.like,
  });
  filtered = await db.client.filterModels(likes);
  count = likes.length;
  if (count) {
    return utils.handlers.success(req, res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(req, res, "general", {
    message: "no likes yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
