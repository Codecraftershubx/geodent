import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const updateConnections = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  const connections = [
    "reviews",
    "likes",
    "tenants",
    "tags",
    "rooms",
    "flats",
    "blocks",
  ];
  const connectObject = {} as Prisma.ListingUpdateInput;
  const { extend } = req.query;

  // verify room exists
  const listing = await db.client.client.listing.findMany({
    where: { id, isDeleted: false },
  });
  if (!listing.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `listing not found`,
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
  // update listing
  try {
    let updated = await db.client.client.listing.update({
      where: { id },
      data: { ...connectObject },
      include: db.client.include.listing,
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
      message: err?.message ?? err.toString(),
      data: [{ details: err }],
    });
  }
};

export default updateConnections;
