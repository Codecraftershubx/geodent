import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
  // validate sent data
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { data } = matchedData(req);

  // ensure it's a valid state
  const state = await db.client.client.state.findMany({
    where: { id: data.stateId, isDeleted: false },
  });

  if (!state.length) {
    return utils.handlers.error(req, res, "validation", {
      message: `state ${data.stateId} not found`,
      status: 404,
    });
  }
  // avoid duplicate entries
  const existingCity = await db.client.client.city.findMany({
    where: {
      name: data.name,
      stateId: data.stateId,
      isDeleted: false,
    },
  });
  if (existingCity.length) {
    return utils.handlers.error(req, res, "general", {
      message: "city already exists",
      status: 400,
    });
  }

  // proced to create;
  try {
    const city = await db.client.client.city.create({
      data: { ...data, name: utils.text.titleCase(data.name) },
      include: db.client.include.city,
    });
    const filtered = await db.client.filterModels([city]);
    return utils.handlers.success(req, res, {
      message: "city created successfully",
      data: filtered,
    });
  } catch (err: any) {
    return utils.handlers.error(req, res, "general", {
      message: err?.message ?? "some error occured",
      data: [{ details: err }],
    });
  }
};

export default create;
