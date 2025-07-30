import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import { Prisma } from "@prisma/client";

const create = async (req: Request, res: Response): Promise<void> => {
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

  const data = matchedData(req);
  try {
    /* ------------------------- */
    /* - Validate State Exists - */
    /* ------------------------- */
    const state = await db.client.client.state.findUnique({
      where: { id: data.stateId, isDeleted: false },
    });

    if (!state) {
      return utils.handlers.error(req, res, "validation", {
        message: `state ${data.stateId} not found`,
        errno: 13,
      });
    }
    /* --------------------------- */
    /* - Avoid duplicate entries - */
    /* --------------------------- */
    const existingCity = await db.client.client.city.findMany({
      where: {
        name: data.name,
        stateId: data.stateId,
        isDeleted: false,
      },
    });
    if (existingCity.length) {
      return utils.handlers.error(req, res, "validation", {
        errno: 14,
      });
    }

    /* ----------------- */
    /* - Update Create - */
    /* ----------------- */
    const city = await db.client.client.city.create({
      data: {
        ...data,
        name: utils.text.titleCase(data.name),
      } as Prisma.CityCreateInput,
      include: db.client.include.city,
    });
    const filtered = await db.client.filterModels([city]);
    return utils.handlers.success(req, res, {
      message: "city created",
      data: filtered,
      code: 201,
      count: 1,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default create;
