import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one tag by id
  const { id } = req.params;
  let count;
  let filtered;
  const include = {
    blocks: { omit: db.client.omit.default },
    flats: { omit: db.client.omit.default },
    listings: { omit: db.client.omit.default },
    rooms: { omit: db.client.omit.default },
  };
  if (id) {
    const tag = await db.client.client.tag.findMany({
      where: { id, isDeleted: false },
      include,
    });
    count = tag.length;
    if (count) {
      filtered = await db.client.filterModels(tag);
      return utils.handlers.success(res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `tag not found`,
      status: 404,
    });
  }
  // get all tags
  const tags = await db.client.client.tag.findMany({
    where: { isDeleted: false },
    include,
  });
  filtered = await db.client.filterModels(tags);
  count = tags.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no tag created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
