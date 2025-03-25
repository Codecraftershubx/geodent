import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify listing exists and is deleted
  const listing = await db.client.client.listing.findMany({
    where: { id, isDeleted: true },
  });
  if (!listing.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `listing not found`,
    });
  }
  // restore listing
  await db.client.client.listing.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(res, {
    message: "listing restored successfully",
    count: 1,
  });
};

export default restore;
