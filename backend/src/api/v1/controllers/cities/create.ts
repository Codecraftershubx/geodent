import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
  // validate sent data
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { data } = matchedData(req);

  // ensure it's a valid state
  const state = await db.client.client.state.findMany({
    where: { id: data.stateId },
  });

  if (!state.length) {
    return utils.handlers.error(res, "validation", {
      message: `state ${data.stateId} not found`,
      status: 404,
    });
  }
  // avoid duplicate entries
  const existingCity = await db.client.client.city.findMany({
    where: {
      name: data.name,
      stateId: data.stateId,
    },
  });
  if (existingCity.length) {
    return utils.handlers.error(res, "general", {
      message: "city already exists",
      status: 400,
    });
  }

  // proced to create;
  try {
    const city = await db.client.client.city.create({
      data: { ...data },
    });
    return utils.handlers.success(res, {
      message: "city created successfully",
      data: [{ id: city.id }],
    });
  } catch (err: any) {
    return utils.handlers.error(res, "general", {
      message: err?.message ?? "some error occured",
      data: [{ details: err }],
    });
  }
};

export default create;
