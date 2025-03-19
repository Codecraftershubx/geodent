import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one country by id
  const { id } = req.params;
  let count;
  let filtered;
  const include = {
    amenities: { omit: db.client.omit.default },
    tags: { omit: db.client.omit.default },
    documents: { omit: db.client.omit.default },
    landlord: { omit: db.client.omit.user },
  };
  if (id) {
    const room = await db.client.client.room.findMany({
      where: { id, isDeleted: false },
      include,
    });
    count = room.length;
    if (count) {
      filtered = await db.client.filterModels(room);
      return utils.handlers.success(res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `room not found`,
      status: 404,
    });
  }
  // get all countries
  const rooms = await db.client.client.room.findMany({
    where: { isDeleted: false },
    include,
  });
  filtered = await db.client.filterModels(rooms);
  count = rooms.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no room created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
