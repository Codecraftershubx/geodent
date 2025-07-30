import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import db from "../../../../../db/utils/index.js";
import utils from "../../../../../utils/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }

  const { id } = req.params;
  let filtered;
  /* ---------------------------- */
  /* - Validate Chatroom Exists - */
  /* ---------------------------- */
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
  try {
    const data = req.body;
    const { messageId } = req.params;
    const fields = ["content", "isDelivered", "isRead", "isSent"];
    /* --------------------------- */
    /* - Validate Message Exists - */
    /* --------------------------- */
    const message = chatroom.messages.filter((msg) => {
      return msg.id === messageId && !msg.isDeleted;
    });
    if (!message.length) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* ----------------TODO---------------- */
    /* - Validate User Posted the Message - */
    /* ------------------------------------ */

    /* ------------------ */
    /* - Update Message - */
    /* ------------------ */
    const updateData = {} as Prisma.MessageUpdateInput;
    for (let field of fields) {
      if (data[field]) {
        Object.assign(updateData, {
          [field]: data[field],
        });
      }
    }
    const updated = await db.client.client.message.update({
      where: { id: messageId },
      data: updateData,
      include: {
        document: { omit: db.client.omit.default },
      },
    });
    filtered = await db.client.filterModels([updated]);
    return utils.handlers.success(req, res, {
      message: `update successful`,
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};
export default create;
