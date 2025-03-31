import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }
  // get one rental by id
  const { id } = req.params;
  if (id) {
    const rental = await db.client.client.rental.findUnique({
      where: { id, isDeleted: false },
      include: db.client.include.rental,
    });
    if (!rental) {
      return utils.handlers.error(res, "general", {
        message: `rental ${id} not found`,
        status: 404,
      });
    }
    return utils.handlers.success(res, {
      message: "query successful",
      data: await db.client.filterModels([rental]),
      count: 1,
    });
  }
  // get all rentals
  const rentals = await db.client.client.rental.findMany({
    where: { isDeleted: false },
    include: db.client.include.rental,
  });
  const count = rentals.length;
  if (count) {
    console.log(typeof rentals[0]);
    return utils.handlers.success(res, {
      message: "query success",
      data: await db.client.filterModels(rentals),
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no rental created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
