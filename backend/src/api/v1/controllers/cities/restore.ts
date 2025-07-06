import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restoreCity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify flag exists
  const city = await db.client.client.city.findMany({
    where: { id, isDeleted: true },
  });
  if (!city.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `city not found`,
    });
  }
  // restore city
  await db.client.client.city.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(req, res, {
    message: "city restored successfully",
    count: 1,
  });
};

export default restoreCity;
