import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify address exists
  const address = await db.client.client.address.findMany({
    where: { id, isDeleted: true },
  });
  if (!address.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `address not found`,
    });
  }
  // restore address
  await db.client.client.address.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(res, {
    message: "address restored successfully",
    count: 1,
  });
};

export default restore;
