import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // verify review exists and is deleted
    const rental = await db.client.client.rental.findUnique({
      where: { id, isDeleted: true },
    });
    if (!rental) {
      return utils.handlers.error(res, "validation", {
        status: 404,
        message: `rental ${id} not found`,
      });
    }
    // restore rental
    await db.client.client.rental.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    return utils.handlers.success(res, {
      message: "rental restored successfully",
      count: 1,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(res, "general", {
      message: err?.message ?? "an error occured",
    });
  }
};

export default restore;
