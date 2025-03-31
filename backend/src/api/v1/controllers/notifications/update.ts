import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
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

  try {
    // verify notification exists
    const notification = await db.client.client.notification.findUnique({
      where: { id, isDeleted: false },
    });
    if (!notification) {
      return utils.handlers.error(res, "validation", {
        status: 404,
        message: `notification ${id} not found`,
      });
    }

    // create update data and update rental
    const fields = ["message", "isRead"];
    const updateData = {} as Prisma.NotificationUpdateInput;
    for (let field of fields) {
      if (data[field]) {
        Object.assign(updateData, { [field]: data[field] });
      }
    }
    let updatedNotification = await db.client.client.notification.update({
      where: { id },
      data: updateData,
      include: { receiver: { omit: db.client.omit.user } },
    });
    const filtered = await db.client.filterModels([updatedNotification]);
    return utils.handlers.success(res, {
      message: "update successful",
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(res, "general", {
      message: err?.message ?? "an error occured",
    });
  }
};

export default update;
