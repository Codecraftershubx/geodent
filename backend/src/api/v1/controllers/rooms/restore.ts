import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restoreRoom = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify room exists and is deleted
  const document = await db.client.client.room.findMany({
    where: { id, isDeleted: true },
  });
  if (!document.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `room not found`,
    });
  }
  // restore room
  await db.client.client.room.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(req, res, {
    message: "room restored successfully",
    count: 1,
  });
};

export default restoreRoom;
