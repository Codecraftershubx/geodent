import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteFlat = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify flat exists
  const flat = await db.client.client.flat.findMany({
    where: { id, isDeleted: false },
  });
  if (!flat.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `room not found`,
    });
  }
  // delete room
  await db.client.client.flat.update({
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

export default deleteFlat;
