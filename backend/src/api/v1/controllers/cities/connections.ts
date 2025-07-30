import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const updateConnections = async (
  req: Request,
  res: Response
): Promise<void> => {
  /* ---------------------------------------- */
  /* - Validate User Logged In and is Admin - */
  /* ---------------------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  const { profile: user } = req.body?.auth?.profile;
  if (!user || !user.isAdmin) {
    return utils.handlers.error(req, res, "authentication", { errno: 31 });
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
  const connections = ["listings", "schools", "documents", "tags"];
  const connectObject = {} as Prisma.CityUpdateInput;
  const { extend } = req.query;

  /* ------------------------ */
  /* - Validate City Exists - */
  /* ------------------------ */
  const city = await db.client.client.city.findMany({
    where: { id, isDeleted: false },
  });
  if (!city.length) {
    return utils.handlers.error(req, res, "validation", {
      errno: 13,
    });
  }
  // construct update object
  for (let field of connections) {
    // [TODO!!] check if each id provided is valid
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
  /* --------------- */
  /* - Update City - */
  /* --------------- */
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
    return utils.handlers.success(req, res, {
      message: "update successful",
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      message: err?.message ?? err.toString(),
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default updateConnections;
