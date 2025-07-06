import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restoreTag = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify tag exists
  const document = await db.client.client.tag.findMany({
    where: { id, isDeleted: true },
  });
  if (!document.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `tag not found`,
    });
  }
  // restore tag
  await db.client.client.tag.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(req, res, {
    message: "tag restored successfully",
    count: 1,
  });
};

export default restoreTag;
