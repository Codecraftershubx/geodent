import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify country exists
  const country = await db.client.client.country.findMany({
    where: { id, isDeleted: true },
  });
  if (!country.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `country not found`,
    });
  }
  // restore country
  await db.client.client.country.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(req, res, {
    message: "country restored successfully",
    count: 1,
  });
};

export default restore;
