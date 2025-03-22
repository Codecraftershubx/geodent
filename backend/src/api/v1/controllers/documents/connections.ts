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
  const connectObject = {} as Prisma.UserUpdateInput;
  const { extend } = req.query;

  // verify document exists
  const document = await db.client.client.document.findMany({
    where: { id, isDeleted: false },
  });
  if (!document.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `document not found`,
    });
  }
  // construct update object for vector fields
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

  // update document
  try {
    let updated = await db.client.client.document.update({
      where: { id },
      data: { ...connectObject },
      include: db.client.include.document,
    });
    const filtered = await db.client.filterModels([updated]);
    return utils.handlers.success(res, {
      message: "update successful",
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    console.log(err);
    return utils.handlers.error(res, "general", {
      message: err?.message ?? err.toString(),
      data: [{ details: err }],
    });
  }
};

export default updateConnections;
