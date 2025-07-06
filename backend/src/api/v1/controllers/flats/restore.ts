import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restoreFlat = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify flag exists
  const flat = await db.client.client.flat.findMany({
    where: { id, isDeleted: true },
  });
  if (!flat.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `flat not found`,
    });
  }
  // restore tag
  await db.client.client.flat.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(req, res, {
    message: "flat restored successfully",
    count: 1,
  });
};

export default restoreFlat;
