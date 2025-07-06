import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteAddress = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify amenity exists
  const address = await db.client.client.address.findMany({
    where: { id, isDeleted: false },
  });
  if (!address.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `address not found`,
    });
  }
  // delete amenity
  await db.client.client.address.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    },
  });
  return utils.handlers.success(req, res, {
    message: "address deleted",
    count: 1,
  });
};

export default deleteAddress;
