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
  const connections = ["campuses", "documents", "listings", "tags"];
  const connectObject = {} as Prisma.SchoolUpdateInput;
  const { extend } = req.query;

  // verify school exists
  const school = await db.client.client.school.findMany({
    where: { id, isDeleted: false },
  });
  if (!school.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `school not found`,
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
  // update school
  try {
    let updated = await db.client.client.school.update({
      where: { id },
      data: { ...connectObject },
      include: db.client.include.school,
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
      message: err?.message ?? err.toString(),
      data: [{ details: err }],
    });
  }
};

export default updateConnections;
