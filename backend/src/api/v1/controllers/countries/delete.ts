import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteCountry = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify country exists
  const country = await db.client.client.country.findMany({
    where: { id, isDeleted: false },
  });
  if (!country.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `not found`,
    });
  }
  // delete country
  await db.client.client.country.update({
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

export default deleteCountry;
