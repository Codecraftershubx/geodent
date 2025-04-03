import { Request, Response } from "express";
import db from "../../../../../db/utils/index.js";
import utils from "../../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let count;
  let filtered;
  // verify chatroom
  const chatroom = await db.client.client.chatroom.findUnique({
    where: { id, isDeleted: false },
    include: db.client.include.chatroom,
  });
  if (!chatroom) {
    return utils.handlers.error(res, "general", {
      message: `chatroom not found`,
      status: 404,
    });
  }
  // get chatroom messages
  try {
    // get one chatroom message by id
    const id = req.params.messageId || null;
    if (id) {
      // validate message exists
      const message = await db.client.client.message.findUnique({
        where: { id, isDeleted: false },
        include: db.client.include.message,
      });
      if (!message) {
        return utils.handlers.error(res, "validation", {
          message: `message ${req.query.id} not found`,
          status: 404,
        });
      }
      filtered = await db.client.filterModels([message]);
      return utils.handlers.success(res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    // get all chatroom messages
    const messages = await db.client.client.message.findMany({
      where: { isDeleted: false },
      include: db.client.include.message,
    });
    filtered = await db.client.filterModels(messages);
    count = filtered.length;
    if (!count) {
      return utils.handlers.error(res, "general", {
        message: "no message created yet",
        satus: 404,
      });
    }
    return utils.handlers.success(res, {
      message: "query successful",
      count,
      data: filtered,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(res, "general", {
      message: err?.message ?? "an error occured",
    });
  }
};
export default read;
