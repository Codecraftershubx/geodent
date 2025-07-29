import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

/**
 * Manages A block's connections to other entities like Documents,
 * Rooms, Flats, etc.
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
  const connections = ["flats", "rooms", "amenities", "documents", "tags"];
  const connectObject = {} as Prisma.BlockUpdateInput;
  try {
    /* -------------------------- */
    /* - Validate Block Exists - */
    /* ------------------------- */
    const block = await db.client.client.block.findUnique({
      where: { id, isDeleted: false },
    });
    if (!block) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    // construct update object
    for (let field of connections) {
      if (data[field]) {
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
    let updated = await db.client.client.block.update({
      where: { id },
      data: { ...connectObject },
      include: db.client.include.block,
    });
    const filtered = await db.client.filterModels([updated]);
    return utils.handlers.success(req, res, {
      message: "update successful",
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    console.log(err);
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default updateConnections;
