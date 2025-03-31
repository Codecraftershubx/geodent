import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  // verify notification exists
  try {
    const notification = await db.client.client.notification.findUnique({
      where: { id, isDeleted: false },
    });
    if (!notification) {
      return utils.handlers.error(res, "validation", {
        status: 404,
        message: `notification ${id} not found`,
      });
    }
    // delete notification
    await db.client.client.notification.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      },
    });
    return utils.handlers.success(res, {
      message: "delete successful",
      count: 1,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(res, "general", {
      message: err?.message ?? "some error occured",
    });
  }
};

export default deleteNotification;
