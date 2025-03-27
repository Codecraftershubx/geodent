import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify room exists
  const room = await db.client.client.room.findMany({
    where: { id, isDeleted: false },
  });
  if (!room.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `room not found`,
    });
  }
  // delete room
  await db.client.client.room.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    },
  });
  return utils.handlers.success(res, {
    message: "delete successful",
    count: 1,
  });
};

export default deleteRoom;
