import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import type { ChatroomType } from "../../../../utils/types.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    // get chatroom by id if exists
    try {
      const chatroom = await db.client.client.chatroom.findUnique({
        where: { id, isDeleted: false },
        include: db.client.include.chatroom,
      });
      if (chatroom) {
        filtered = await db.client.filterModels([chatroom]);
        return utils.handlers.success(res, {
          message: "query successful",
          data: filtered,
          count,
        });
      }
      return utils.handlers.error(res, "general", {
        message: `chatroom not found`,
        status: 404,
      });
    } catch (err: any) {
      return utils.handlers.error(res, "general", {
        message: err?.message ?? "some error occured",
      });
    }
  }
  // get all chatrooms
  const whereData = { isDeleted: false } as Record<string, any>;
  if (req.query.type) {
    whereData["type"] = req.query.type as ChatroomType;
  }

  try {
    const chatrooms = await db.client.client.chatroom.findMany({
      where: { ...whereData },
      include: db.client.include.chatroom,
    });
    filtered = await db.client.filterModels(chatrooms);
    count = chatrooms.length;
    if (count) {
      return utils.handlers.success(res, {
        message: "query success",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: "no chatroom created yet",
      status: 404,
      count: 0,
      data: [],
    });
  } catch (err: any) {
    return utils.handlers.error(res, "general", {
      message: err?.message ?? "some error occured",
    });
  }
};

export default read;
