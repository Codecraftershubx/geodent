import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify user exists
  const user = await db.client.client.user.findMany({
    where: { id, isDeleted: true },
  });
  if (!user.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `user not found`,
    });
  }
  // restore city
  await db.client.client.user.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(res, {
    message: "user restored successfully",
    count: 1,
  });
};

export default restore;
