import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let count;
  let filtered;
  const include = {
    address: { omit: db.client.omit.default },
    listing: { omit: db.client.omit.default },
    landlord: { omit: db.client.omit.user },
    rooms: { omit: db.client.omit.default },
    flats: { omit: db.client.omit.default },
    amenities: { omit: db.client.omit.default },
    tags: { omit: db.client.omit.default },
    documents: { omit: db.client.omit.default },
  };
  if (id) {
    // get one block by id
    const block = await db.client.client.block.findMany({
      where: { id, isDeleted: false },
      include,
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
    include,
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
