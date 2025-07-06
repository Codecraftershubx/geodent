import { Request, Response } from "express";
import db from "../../../../../db/utils/index.js";
import utils from "../../../../../utils/index.js";

const deleteChatroom = async (req: Request, res: Response): Promise<void> => {
  const { id, messageId } = req.params;

  // verify chatroom
  const chatroom = await db.client.client.chatroom.findUnique({
    where: { id, isDeleted: false },
    include: db.client.include.chatroom,
  });
  if (!chatroom) {
    return utils.handlers.error(req, res, "general", {
      message: `chatroom ${id} not found`,
      status: 404,
    });
  }

  const message = db.client.client.message.findUnique({
    where: { id: messageId, isDeleted: false, chatroomId: id },
  });

  if (!message) {
    return utils.handlers.error(req, res, "validation", {
      message: `message ${messageId} not found or not not in chatroom`,
      status: 404,
    });
  }

  // delete message
  await db.client.client.message.update({
    where: { id: messageId },
    data: {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    },
  });
  return utils.handlers.success(req, res, {
    message: "delete successful",
    count: 1,
  });
};

export default deleteChatroom;
