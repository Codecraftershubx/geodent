import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteListing = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify listing exists
  const listing = await db.client.client.listing.findMany({
    where: { id, isDeleted: false },
  });
  if (!listing.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `listing not found`,
    });
  }
  // delete listing
  await db.client.client.listing.update({
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

export default deleteListing;
