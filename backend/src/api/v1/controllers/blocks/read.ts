import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    // get one block by id
    const block = await db.client.client.block.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.block,
    });
    count = block.length;
    if (count) {
      filtered = await db.client.filterModels(block);
      return utils.handlers.success(res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `block not found`,
      status: 404,
    });
  }
  // get all blocks
  const blocks = await db.client.client.block.findMany({
    where: { isDeleted: false },
    include: db.client.include.block,
  });
  filtered = await db.client.filterModels(blocks);
  count = blocks.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no block created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
