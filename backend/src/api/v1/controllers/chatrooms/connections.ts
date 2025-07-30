import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

/**
 * Manages A chatroom's connections to other entities like Documents,
 * Participants, etc.
 * @func updateConnections
 * @param req[Express.Request] Request object
 * @param res[Express.Response] Response object
 * @returns {Promise<Record<string, any>>}
 */
const updateConnections = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  const { id } = req.params;
  const { extend } = req.query;
  const connections = ["documents", "participants"];
  const connectObject = {} as Prisma.ChatroomUpdateInput;

  try {
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
            return utils.handlers.error(req, res, "validation", {
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

    /* --------------------- */
    /* - proceed to update - */
    /* --------------------- */
    let updated = await db.client.client.chatroom.update({
      where: { id },
      data: { ...connectObject },
      include: db.client.include.chatroom,
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

export default updateConnections;
