import { Request, Response } from "express";
import db from "../../../../../db/utils/index.js";
import utils from "../../../../../utils/index.js";

const deleteChatroom = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }

  /* ---------------------------- */
  /* - Validate Chatroom Exists - */
  /* ---------------------------- */
  try {
    const { id, messageId } = req.params;
    const chatroom = await db.client.client.chatroom.findUnique({
      where: { id, isDeleted: false },
      include: db.client.include.chatroom,
    });
    if (!chatroom) {
      return utils.handlers.error(req, res, "validation", {
        message: `chatroom not found`,
        errno: 13,
      });
    }
    /* -------------------------------- */
    /* - Validate Message not deleted - */
    /* -------------------------------- */
    const message = db.client.client.message.findUnique({
      where: { id: messageId, isDeleted: false, chatroomId: id },
    });
    if (!message) {
      return utils.handlers.error(req, res, "validation", {
        message: `message not found`,
        errno: 13,
      });
    }

    /* ------------------ */
    /* - Delete Message - */
    /* ------------------ */
    await db.client.client.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      },
    });
    return utils.handlers.success(req, res, {
      message: "deleted",
      count: 1,
      errno: 44,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default deleteChatroom;
