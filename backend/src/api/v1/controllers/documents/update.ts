import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const update = async (req: Request, res: Response): Promise<void> => {
  // get one city by id
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { id } = req.params;
  const { data } = matchedData(req);

  // verify address exists
  const address = await db.client.client.document.findMany({
    where: { id, isDeleted: false },
  });
  if (!address.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `document not found`,
    });
  }
  // update address
  try {
    let updated = await db.client.client.document.update({
      where: { id },
      data,
    });
    const filtered = await db.client.filterModels([updated]);
    return utils.handlers.success(req, res, {
      message: "update successful",
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    return utils.handlers.error(req, res, "general", {
      message: "document update failed",
      data: [{ details: err.toString() }],
    });
  }
};

export default update;
