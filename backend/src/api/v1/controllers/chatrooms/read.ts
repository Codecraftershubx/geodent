import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import type { ChatroomType } from "../../../../utils/types.js";

const read = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    /* -------------------------- *
     * - get one chatroom by id - *
     * -------------------------- */
    try {
      const chatroom = await db.client.client.chatroom.findUnique({
        where: { id, isDeleted: false },
        include: db.client.include.chatroom,
      });
      if (chatroom) {
        return utils.handlers.success(req, res, {
          message: "query successful",
          data: await db.client.filterModels([chatroom]),
          count: 1,
        });
      }
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    } catch (err: any) {
      console.log("error occured");
      return utils.handlers.error(req, res, "general", {
        data: [{ details: JSON.stringify(err) }],
      });
    }
  }
  /* ------------------------------------ *
   * get all chatrooms ------------------ *
   * first validate user is admin: only - *
   * admin can fetch all chatrooms ------ *
   * ------------------------------------ */
  const { profile: user } = req.body?.auth?.profile;
  if (!user || !user.isAdmin) {
    return utils.handlers.error(req, res, "authentication", {});
  }

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
    return utils.handlers.success(req, res, {
      message: count ? "query success" : "no data found",
      data: filtered,
      count,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default read;
