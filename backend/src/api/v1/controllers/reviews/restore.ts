import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify review exists and is deleted
  const review = await db.client.client.review.findMany({
    where: { id, isDeleted: true },
  });
  if (!review.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `review ${id} not found`,
    });
  }
  // restore review
  await db.client.client.review.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(req, res, {
    message: "review restored successfully",
    count: 1,
  });
};

export default restore;
