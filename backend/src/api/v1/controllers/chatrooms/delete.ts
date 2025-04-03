import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteChatroom = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify chatroom exists
  const chatroom = await db.client.client.chatroom.findUnique({
    where: { id, isDeleted: false },
  });
  if (!chatroom) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `chatroom ${id} not found`,
    });
  }
  // delete chatroom
  await db.client.client.chatroom.update({
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
};

export default deleteChatroom;
