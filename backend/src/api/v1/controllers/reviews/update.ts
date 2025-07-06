import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const update = async (req: Request, res: Response): Promise<void> => {
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

  // verify review exists
  const review = await db.client.client.review.findMany({
    where: { id, isDeleted: false },
  });
  if (!review.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `review ${id} not found`,
    });
  }
  // update review
  let updatedReview = await db.client.client.review.update({
    where: { id },
    data,
  });
  const filtered = await db.client.filterModels([updatedReview]);
  return utils.handlers.success(req, res, {
    message: "update successful",
    count: 1,
    data: filtered,
  });
};

export default update;
