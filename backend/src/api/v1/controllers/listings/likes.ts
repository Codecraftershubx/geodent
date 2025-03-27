import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import services from "../services/index.js";

const like = async (req: Request, res: Response): Promise<void> => {
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
  const { userId }: { userId: string } = data;

  // verify listing and liker exist
  const listing = await db.client.client.listing.findMany({
    where: { id, isDeleted: false },
  });
  if (!listing.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `listing ${id} not found`,
    });
  }
  const user = await db.client.client.user.findMany({
    where: { id: userId, isDeleted: false },
  });
  if (!user.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `user ${userId} not found`,
    });
  }

  // update user
  let result = await services.likes(userId, "LISTING", id);
  if (result.error) {
    return utils.handlers.error(res, "validation", {
      message: result.message,
      status: result.status,
    });
  }
  const filtered = await db.client.filterModels([result.data.data]);
  return utils.handlers.success(res, {
    message: result.data.message,
    count: 1,
    data: filtered,
  });
};

export default like;
