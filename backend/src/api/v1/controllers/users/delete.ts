import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify user exists
  const user = await db.client.client.user.findMany({
    where: { id, isDeleted: false },
  });
  if (!user.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `user not found`,
    });
  }
  // delete user
  await db.client.client.user.update({
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

export default deleteUser;
