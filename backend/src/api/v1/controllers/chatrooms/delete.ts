import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteChatroom = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }

  try {
    const { id } = req.params;
    /* ---------------------------- */
    /* - Validate Chatroom Exists - */
    /* ---------------------------- */
    const chatroom = await db.client.client.chatroom.findUnique({
      where: { id, isDeleted: false },
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
    /* - Delete Chatroom - */
    /* ------------------- */
    await db.client.client.chatroom.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      },
    });
    return utils.handlers.success(req, res, {
      message: "deleted",
      errno: 44,
      count: 1,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default deleteChatroom;
