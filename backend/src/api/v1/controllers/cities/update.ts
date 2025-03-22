import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const update = async (req: Request, res: Response): Promise<void> => {
  // get one city by id
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { id } = req.params;
  const { data } = matchedData(req);

  // verify school exists
  const city = await db.client.client.city.findMany({
    where: { id, isDeleted: false },
  });
  if (!city.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `city not found`,
    });
  }
  // update school
  let updatedCity = await db.client.client.city.update({
    where: { id },
    data,
    include: db.client.include.city,
  });
  const filtered = await db.client.filterModels([updatedCity]);
  return utils.handlers.success(res, {
    message: "update successful",
    count: 1,
    data: filtered,
  });
};

export default update;
