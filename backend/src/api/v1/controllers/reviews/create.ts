import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import services from "../services/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
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
  try {
    const {
      reviewerId,
      rating,
      message,
      target,
    }: {
      reviewerId: string;
      rating: number;
      message: string;
      target: "AGENT" | "LANDLORD" | "LISTING";
    } = data;

    // verify target user/listing and reviewer exist
    let targetItem;
    if (target === "AGENT" || target === "LANDLORD") {
      targetItem = await db.client.client.user.findMany({
        where: { id, isDeleted: false },
      });
    } else {
      targetItem = await db.client.client.listing.findMany({
        where: { id, isDeleted: false },
      });
    }
    if (!targetItem.length) {
      return utils.handlers.error(req, res, "validation", {
        status: 404,
        message: `${utils.text.lowerCase(target)} ${id} not found`,
      });
    }

    // verify reviewer
    const reviewer = await db.client.client.user.findMany({
      where: { id: reviewerId, isDeleted: false },
    });
    if (!reviewer.length) {
      return utils.handlers.error(req, res, "validation", {
        status: 404,
        message: `user ${reviewerId} not found`,
      });
    }
    // create new review
    const result = await services.reviews(reviewerId, target, id, {
      rating,
      message,
    });
    if (result.error) {
      return utils.handlers.error(req, res, "general", {
        message: result.message,
        status: result.status,
      });
    }
    const filtered = await db.client.filterModels([result.data.data]);
    return utils.handlers.success(req, res, {
      message: result.data.message,
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    return utils.handlers.error(req, res, "general", {
      message: `${err?.message || "some error occured"}`,
      status: 500,
    });
  }
};

export default create;
