import { Request, Response } from "express";
import db from "../../../../../db/utils/index.js";
import utils from "../../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }

  const chatRoomId = req.params?.id;
  let count;
  let filtered;
  try {
    /* ----------------------------- */
    /* - Validate Chatroom Exists - */
    /* ---------------------------- */
    const chatroom = await db.client.client.chatroom.findUnique({
      where: { id: chatRoomId, isDeleted: false },
      include: db.client.include.chatroom,
    });

    if (!chatroom) {
      return utils.handlers.error(req, res, "validation", {
        message: `chatroom not found`,
        errno: 13,
      });
    }

    /*------------------------------- --- */
    /* - Get one chatroom message by id - */
    /* ---------------------------------- */
    const id = req.params.messageId || null;
    if (id) {
      /* ------------------------------------ *
       * first validate user is admin: only - *
       * admin can fetch only one message --- *
       * ------------------------------------ */
      const { profile: user } = req.body?.auth?.profile;
      if (!user || !user.isAdmin) {
        return utils.handlers.error(req, res, "authentication", {});
      }

      /* validate message exists */
      const message = await db.client.client.message.findUnique({
        where: { id, isDeleted: false },
        include: db.client.include.message,
      });
      if (!message) {
        return utils.handlers.error(req, res, "validation", {
          message: `message ${req.query.id} not found`,
          errno: 13,
        });
      }
      filtered = await db.client.filterModels([message]);
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: filtered,
        count: 1,
      });
    }
    /* ----------------- TODO ------------------ *
     * - Validate User Is Chatroom Participant - *
     * ----------------------------------------- */

    /*------------------------------ */
    /* - Get all chatroom messages - */
    /* ----------------------------- */
    const messages = await db.client.client.message.findMany({
      where: { isDeleted: false },
      include: db.client.include.message,
    });
    filtered = await db.client.filterModels(messages);
    count = filtered.length;
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
