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
  const connections = ["listings", "schools", "documents", "tags"];
  const connectObject = {} as Prisma.CityUpdateInput;
  const { extend } = req.query;

  // verify city exists
  const city = await db.client.client.city.findMany({
    where: { id, isDeleted: false },
  });
  if (!city.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `city not found`,
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
  // update city
  try {
    let updated = await db.client.client.city.update({
      where: { id },
      data: { ...connectObject },
      include: {
        schools: { omit: db.client.omit.default },
        documents: { omit: db.client.omit.default },
        listings: { omit: db.client.omit.default },
        tags: { omit: db.client.omit.default },
      },
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
