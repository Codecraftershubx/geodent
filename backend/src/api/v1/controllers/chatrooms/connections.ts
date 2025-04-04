import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const updateConnections = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { id } = req.params;
  const { data } = matchedData(req);
  const connections = ["documents", "participants"];
  const connectObject = {} as Prisma.ChatroomUpdateInput;
  const { extend } = req.query;

  // verify chatroom exists
  try {
    const chatroom = await db.client.client.chatroom.findUnique({
      where: { id, isDeleted: false },
    });
    if (!chatroom) {
      return utils.handlers.error(res, "validation", {
        status: 404,
        message: `chatroom not found`,
      });
    }
    // construct update object
    for (let field of connections) {
      let tempItem;
      if (data[field]) {
        // validate ids
        data[field].forEach(async (fieldId: string) => {
          tempItem =
            field === "documents"
              ? await db.client.client.document.findUnique({
                  where: { id: fieldId, isDeleted: false },
                })
              : await db.client.client.user.findUnique({
                  where: { id: fieldId, isDeleted: false },
                });
          if (!tempItem) {
            return utils.handlers.error(res, "validation", {
              message: `${field.slice(0, field.length - 2)} ${id} not found`,
              status: 404,
            });
          }
        });
        if (extend) {
          Object.assign(connectObject, {
            [field]: {
              connect: data[field].map((id: string) => {
                return { id };
              }),
            },
          });
        } else {
          Object.assign(connectObject, {
            [field]: {
              disconnect: data[field].map((id: string) => {
                return { id };
              }),
            },
          });
        }
      }
    }

    // update chatroom
    let updated = await db.client.client.chatroom.update({
      where: { id },
      data: { ...connectObject },
      include: db.client.include.chatroom,
    });
    const filtered = await db.client.filterModels([updated]);
    return utils.handlers.success(res, {
      message: "update successful",
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(res, "general", {
      message: err?.message ?? err.toString(),
      data: [{ details: err }],
    });
  }
};

export default updateConnections;
