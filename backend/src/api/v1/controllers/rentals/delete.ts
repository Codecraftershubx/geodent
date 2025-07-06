import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteRental = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify rental exists
  try {
    const rental = await db.client.client.rental.findUnique({
      where: { id, isDeleted: false },
    });
    if (!rental) {
      return utils.handlers.error(req, res, "validation", {
        status: 404,
        message: `rental ${id} not found`,
      });
    }
    // delete rental
    await db.client.client.rental.update({
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
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(req, res, "general", {
      message: err?.message ?? "some error occured",
    });
  }
};

export default deleteRental;
