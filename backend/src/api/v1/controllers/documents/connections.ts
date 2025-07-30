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

  /* ------------TODO------------------- */
  /* - Validate User Owns the Document - */
  /* ----------------------------------- */

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
  const scalarConnections = [
    "chatroom",
    "listing",
    "user",
    "verification",
    "room",
    "flat",
    "block",
    "school",
    "campus",
    "city",
    "country",
    "state",
  ];
  const connectObject = {} as Prisma.DocumentUpdateInput;
  const { extend } = req.query;

  try {
    /* ---------------------------- */
    /* - Validate Document Exists - */
    /* ---------------------------- */
    const document = await db.client.client.document.findUnique({
      where: { id, isDeleted: false },
    });
    if (!document) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* ------------------------------------------- */
    /* Construct update object for vector fields - */
    /* ------------------------------------------- */
    //
    for (let scalarField of scalarConnections) {
      // [UPDATE!!] check if each id provided is valid
      if (data[scalarField]) {
        if (extend) {
          Object.assign(connectObject, {
            [scalarField]: { connect: { id: data[scalarField][0] } },
          });
        } else {
          Object.assign(connectObject, {
            [scalarField]: { disconnect: { id: data[scalarField][0] } },
          });
        }
      }
    }
    /* ------------------- */
    /* - Update Document - */
    /* ------------------- */
    let updated = await db.client.client.document.update({
      where: { id },
      data: { ...connectObject },
      include: db.client.include.document,
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
