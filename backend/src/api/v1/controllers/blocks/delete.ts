import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteBlock = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify block exists
  const block = await db.client.client.block.findMany({
    where: { id, isDeleted: false },
  });
  if (!block.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `block not found`,
    });
  }
  // delete block
  await db.client.client.block.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    },
  });
  return utils.handlers.success(req, res, {
    message: "delete successful",
    count: 1,
  });
};

export default deleteBlock;
