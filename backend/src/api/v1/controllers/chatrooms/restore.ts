import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  try {
    /* ------------------------------------------- */
    /* - Validate Chatroom Exists and is Deleted - */
    /* ------------------------------------------- */
    const { id } = req.params;
    const chatroom = await db.client.client.chatroom.findUnique({
      where: { id, isDeleted: true },
    });
    if (!chatroom) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* ------------- TODO ---------------- *
     * - Validate User Owns the chatroom - *
     * ----------------------------------- */

    /* ------------------- */
    /* - Restore Chatroom - */
    /* ------------------- */
    await db.client.client.chatroom.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    return utils.handlers.success(req, res, {
      message: `chatroom restored`,
      count: 1,
      status: 204,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default restore;
