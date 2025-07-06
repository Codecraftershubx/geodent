import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restoreBlock = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify flag exists
  const block = await db.client.client.block.findMany({
    where: { id, isDeleted: true },
  });
  if (!block.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `block not found`,
    });
  }
  // restore tag
  await db.client.client.block.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(req, res, {
    message: "block restored successfully",
    count: 1,
  });
};

export default restoreBlock;
