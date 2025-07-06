import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
  // validate sent data
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { data } = matchedData(req);
  const { name, type } = data;
  const createData = { name, type } as Prisma.ChatroomCreateInput;
  if (data.webClientId) {
    Object.assign(createData, { webClientId: data.webClientId });
  }
  // proceed to create;
  try {
    const chatroom = await db.client.client.chatroom.create({
      data: createData,
      include: db.client.include.chatroom,
    });

    const filtered = await db.client.filterModels([chatroom]);
    return utils.handlers.success(req, res, {
      message: "chatroom created successfully",
      data: filtered,
      status: 201,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(req, res, "general", {
      message: err?.message ?? "some error occured",
      data: [{ details: err }],
    });
  }
};

export default create;
