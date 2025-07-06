import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify tag exists
  const tag = await db.client.client.tag.findMany({
    where: { id, isDeleted: false },
  });
  if (!tag.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `tag not found`,
    });
  }
  // delete tag
  await db.client.client.tag.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    },
  });
  return utils.handlers.success(req, res, {
    message: "tag deleted successfully",
    count: 1,
  });
};

export default deleteRoom;
