import { Request, Response } from "express";
import db from "../../../../../db/utils/index.js";
import utils from "../../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  const { id, messageId } = req.params;

  // verify chatroom exists and is deleted
  const chatroom = await db.client.client.chatroom.findUnique({
    where: { id, isDeleted: false },
  });
  if (!chatroom) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `chatroom ${id} not found`,
    });
  }
  // verify message exists and is in chatroom
  const message = await db.client.client.message.findUnique({
    where: { id: messageId, isDeleted: true, chatroomId: chatroom.id },
  });
  if (!message) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `message ${messageId} doesn't exist or not in chatroom`,
    });
  }
  // restore message
  await db.client.client.message.update({
    where: { id: messageId },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(req, res, {
    message: `message ${messageId} restored successfully`,
    count: 1,
  });
};

export default restore;
