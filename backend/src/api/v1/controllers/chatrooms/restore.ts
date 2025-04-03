import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify chatroom exists and is deleted
  const chatroom = await db.client.client.chatroom.findUnique({
    where: { id, isDeleted: true },
  });
  if (!chatroom) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `chatroom ${id} not found`,
    });
  }
  // restore chatroom
  await db.client.client.chatroom.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(res, {
    message: `chatroom ${id} restored successfully`,
    count: 1,
  });
};

export default restore;
