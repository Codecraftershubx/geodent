import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify review exists
  const review = await db.client.client.review.findMany({
    where: { id, isDeleted: false },
  });
  if (!review.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `review ${id} not found`,
    });
  }
  // delete review
  await db.client.client.review.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    },
  });
  return utils.handlers.success(res, {
    message: "delete successful",
    count: 1,
  });
};

export default deleteUser;
