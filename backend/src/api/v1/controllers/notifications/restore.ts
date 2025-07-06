import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // verify notification exists and is deleted
    const notification = await db.client.client.notification.findUnique({
      where: { id, isDeleted: true },
    });
    if (!notification) {
      return utils.handlers.error(req, res, "validation", {
        status: 404,
        message: `notification ${id} not found`,
      });
    }
    // restore notification
    await db.client.client.notification.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    return utils.handlers.success(req, res, {
      message: "notification restored successfully",
      count: 1,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(req, res, "general", {
      message: err?.message ?? "an error occured",
    });
  }
};

export default restore;
