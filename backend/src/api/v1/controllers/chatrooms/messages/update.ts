import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import db from "../../../../../db/utils/index.js";
import utils from "../../../../../utils/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let filtered;
  // verify chatroom
  const chatroom = await db.client.client.chatroom.findUnique({
    where: { id, isDeleted: false },
    include: db.client.include.chatroom,
  });
  if (!chatroom) {
    return utils.handlers.error(req, res, "general", {
      message: `chatroom not found`,
      status: 404,
    });
  }
  // create chatroom message
  try {
    // create chatroom message
    const { data } = req.body;
    const { messageId } = req.params;
    const fields = ["content", "isDelivered", "isRead", "isSent"];

    // validate message
    const message = chatroom.messages.filter((msg) => {
      return msg.id === messageId && !msg.isDeleted;
    });
    if (!message.length) {
      return utils.handlers.error(req, res, "validation", {
        message: `message ${messageId} not found`,
        status: 404,
      });
    }

    // construct update data
    const updateData = {} as Prisma.MessageUpdateInput;
    for (let field of fields) {
      if (data[field]) {
        Object.assign(updateData, {
          [field]: data[field],
        });
      }
    }
    // update message
    const updated = await db.client.client.message.update({
      where: { id: messageId },
      data: updateData,
      include: {
        document: { omit: db.client.omit.default },
      },
    });
    filtered = await db.client.filterModels([updated]);
    return utils.handlers.success(req, res, {
      message: `message ${messageId} updated successfully`,
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(req, res, "general", {
      message: err?.message ?? "an error occured",
    });
  }
};
export default create;
