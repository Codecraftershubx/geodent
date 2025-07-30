import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

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

  const { id } = req.params;
  const data = matchedData(req);
  const connections = ["rooms", "amenities", "documents", "tags"];
  const connectObject = {} as Prisma.FlatUpdateInput;
  const { extend } = req.query;

  try {
    /* ------------------------ */
    /* - Validate Flat Exists - */
    /* ------------------------ */
    const flat = await db.client.client.flat.findUnique({
      where: { id, isDeleted: false },
    });
    if (!flat) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    // construct update object
    for (let field of connections) {
      // [UPDATE!!] check if each id provided is valid
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
    /* -------------- */
    /* - Update Flat  */
    /* -------------- */
    let updated = await db.client.client.flat.update({
      where: { id },
      data: { ...connectObject },
      include: db.client.include.flat,
    });
    const filtered = await db.client.filterModels([updated]);
    return utils.handlers.success(req, res, {
      message: "update successful",
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default updateConnections;
