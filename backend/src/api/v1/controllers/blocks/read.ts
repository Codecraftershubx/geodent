import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let count;
  let filtered;
  try {
    if (id) {
      /* -------------------------- *
       * - get one amenity by id - *
       * ------------------------- */
      const block = await db.client.client.block.findUnique({
        where: { id, isDeleted: false },
        include: db.client.include.block,
      });
      if (block) {
        return utils.handlers.success(req, res, {
          message: "query success",
          data: await db.client.filterModels([block]),
          count: 1,
        });
      }
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* ------------------ *
     * - get all blocks - *
     * ------------------ */
    const blocks = await db.client.client.block.findMany({
      where: { isDeleted: false },
      include: db.client.include.block,
    });
    filtered = await db.client.filterModels(blocks);
    count = blocks.length;
    return utils.handlers.success(req, res, {
      message: count ? "query success" : "no data found",
      data: filtered,
      count,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default read;
