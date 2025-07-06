import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one country by id
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    // get one flat by id
    const flat = await db.client.client.flat.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.room,
    });
    count = flat.length;
    if (count) {
      filtered = await db.client.filterModels(flat);
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(req, res, "general", {
      message: `flat not found`,
      status: 404,
    });
  }
  // get all flats
  const flats = await db.client.client.flat.findMany({
    where: { isDeleted: false },
    include: db.client.include.room,
  });
  filtered = await db.client.filterModels(flats);
  count = flats.length;
  if (count) {
    return utils.handlers.success(req, res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(req, res, "general", {
    message: "no flat created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
