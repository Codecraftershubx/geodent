import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one notification by id
  const { id } = req.params;
  if (id) {
    const notification = await db.client.client.notification.findUnique({
      where: { id, isDeleted: false },
      include: { receiver: { omit: db.client.omit.user } },
    });
    if (!notification) {
      return utils.handlers.error(res, "general", {
        message: `notification ${id} not found`,
        status: 404,
      });
    }
    return utils.handlers.success(res, {
      message: "query successful",
      data: await db.client.filterModels([notification]),
      count: 1,
    });
  }
  // get all notifications
  const notifications = await db.client.client.notification.findMany({
    where: { isDeleted: false },
    include: { receiver: { omit: db.client.omit.user } },
  });
  const count = notifications.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: await db.client.filterModels(notifications),
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no notification created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
