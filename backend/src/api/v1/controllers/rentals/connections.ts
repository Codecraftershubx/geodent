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
  const fields = ["tenants"];
  const connectObject = {} as Prisma.RentalUpdateInput;
  const { extend } = req.query;

  try {
    // verify rental exists
    const rental = await db.client.client.rental.findUnique({
      where: { id, isDeleted: false },
    });
    if (!rental) {
      return utils.handlers.error(req, res, "validation", {
        status: 404,
        message: `rental ${id} not found`,
      });
    }

    // verify ids are valid
    for (let field of fields) {
      if (field === "tenants") {
        for (let id of data[field]) {
          const tenant = await db.client.client.user.findUnique({
            where: { id, isDeleted: false },
          });
          if (!tenant) {
            return utils.handlers.error(req, res, "validation", {
              message: `tenant ${id} not found`,
            });
          }
        }
      }
    }

    // construct update object
    for (let field of fields) {
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

    // update rental
    let updated = await db.client.client.rental.update({
      where: { id },
      data: { ...connectObject },
      include: db.client.include.rental,
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
