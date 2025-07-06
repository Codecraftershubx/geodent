import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    // get review if exists
    const review = await db.client.client.review.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.review,
    });
    count = review.length;
    if (count) {
      filtered = await db.client.filterModels(review);
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(req, res, "general", {
      message: `review ${id} not found`,
      status: 404,
    });
  }
  // get all reviews
  const reviews = await db.client.client.review.findMany({
    where: { isDeleted: false },
    include: db.client.include.review,
  });
  filtered = await db.client.filterModels(reviews);
  count = reviews.length;
  if (count) {
    return utils.handlers.success(req, res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(req, res, "general", {
    message: "no reviews yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
