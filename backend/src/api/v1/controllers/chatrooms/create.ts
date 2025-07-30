import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }

  /* ----------------------- */
  /* - Validate sent data - */
  /* ---------------------- */
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      errno: 11,
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const data = matchedData(req);
  const { name, type } = data;
  const createData = { name, type } as Prisma.ChatroomCreateInput;
  /* ALERT!
   * Modify to create a webclient Id and assign to the user. It's
   * no longer sent from frontend. Ignore any that's sent
   * Include it in the response body
   */
  if (data.webClientId) {
    Object.assign(createData, { webClientId: data.webClientId });
  }
  /* ---------------------- */
  /* -  proceed to create - */
  /* ---------------------- */
  try {
    const chatroom = await db.client.client.chatroom.create({
      data: createData,
      include: db.client.include.chatroom,
    });

    const filtered = await db.client.filterModels([chatroom]);
    return utils.handlers.success(req, res, {
      message: "chatroom created",
      data: filtered,
      status: 201,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default create;
