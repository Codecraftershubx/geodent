import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const update = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }

  /* ----------------------------------- */
  /* - Validate User Owns the chatroom - */
  /* ----------------------------------- */

  /* ----------------------- */
  /* - Validate sent data - */
  /* ---------------------- */
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { id } = req.params;
  const { data } = matchedData(req);
  const updateData = {} as Prisma.ChatroomUpdateInput;
  const fields = ["name", "type"];

  /* ---------------------------- */
  /* - Validate Chatroom Exists - */
  /* ---------------------------- */
  try {
    const chatroom = await db.client.client.chatroom.findUnique({
      where: { id, isDeleted: false },
    });
    if (!chatroom) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
        message: `chatroom doesn't exist`,
      });
    }
    // create update data object
    for (let field of fields) {
      if (data[field]) {
        Object.assign(updateData, { [field]: data[field] });
      }
    }

    /* ------------------- */
    /* - Update Chatroom - */
    /* ------------------- */
    let updated = await db.client.client.chatroom.update({
      where: { id },
      data: updateData,
    });
    const filtered = await db.client.filterModels([updated]);
    return utils.handlers.success(req, res, {
      message: "update successful",
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

export default update;
