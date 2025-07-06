import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteAmenity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify amenity exists
  const amenity = await db.client.client.amenity.findMany({
    where: { id, isDeleted: false },
  });
  if (!amenity.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `amenity not found`,
    });
  }
  // delete amenity
  await db.client.client.amenity.update({
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

export default deleteAmenity;
