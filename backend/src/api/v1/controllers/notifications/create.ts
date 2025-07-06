import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import { matchedData, validationResult } from "express-validator";
import utils from "../../../../utils/index.js";
import type { THandlerOptions } from "../../../../utils/types.js";

const createNewRental = async (req: Request, res: Response): Promise<void> => {
  // handle validation errors
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { data } = matchedData(req);

  // validate receiver
  try {
    const receiver = await db.client.client.user.findUnique({
      where: { id: data.receiverId, isDeleted: false },
    });
    if (!receiver) {
      return utils.handlers.error(req, res, "validation", {
        message: `receiver ${data.listingId} not found`,
      });
    }

    // create rental
    const notification = await db.client.client.notification.create({
      data: {
        message: data.message,
        receiver: { connect: { id: data.receiverId } },
      },
      include: { receiver: { omit: db.client.omit.user } },
    });
    const filtered = await db.client.filterModels([notification]);
    return utils.handlers.success(req, res, {
      data: filtered,
      message: "notification created successfully",
      status: 201,
    });
  } catch (err: any) {
    console.error(err);
    const resOptions: THandlerOptions = {
      data: [{ details: err?.message ?? err.toString() }],
      message: "notification creation failed",
    };
    if (err?.code || null === "P2002") {
      resOptions["status"] = 400;
    }
    return utils.handlers.error(req, res, "general", resOptions);
  }
};

export default createNewRental;
