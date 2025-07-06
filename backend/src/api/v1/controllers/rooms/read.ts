import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    // get room by id if exists
    const room = await db.client.client.room.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.room,
    });
    count = room.length;
    if (count) {
      filtered = await db.client.filterModels(room);
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(req, res, "general", {
      message: `room not found`,
      status: 404,
    });
  }
  // get all rooms
  const rooms = await db.client.client.room.findMany({
    where: { isDeleted: false },
    include: db.client.include.room,
  });
  filtered = await db.client.filterModels(rooms);
  count = rooms.length;
  if (count) {
    return utils.handlers.success(req, res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(req, res, "general", {
    message: "no room created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
