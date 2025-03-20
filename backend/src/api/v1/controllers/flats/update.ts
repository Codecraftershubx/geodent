import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const update = async (req: Request, res: Response): Promise<void> => {
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

  // verify flat exists
  const flat = await db.client.client.flat.findMany({
    where: { id, isDeleted: false },
  });
  if (!flat.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `flat not found`,
    });
  }
  // update flat
  let updated = await db.client.client.flat.update({
    where: { id },
    data,
  });
  const filtered = await db.client.filterModels([updated]);
  return utils.handlers.success(res, {
    message: "update successful",
    count: 1,
    data: filtered,
  });
};

export default update;
