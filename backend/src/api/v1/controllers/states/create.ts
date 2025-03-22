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
  // validate country
  const country = await db.client.client.country.findMany({
    where: { id: data.countryId },
  });

  if (!country.length) {
    return utils.handlers.error(res, "validation", {
      message: `country ${data.countryId} not found`,
      status: 404,
    });
  }

  // avoid duplicate entries
  const existingState = await db.client.client.state.findMany({
    where: {
      countryId: data.countryId,
      numericCode: data.numericCode,
    },
  });
  if (existingState.length) {
    return utils.handlers.error(res, "general", {
      message: "state already exists",
      status: 400,
    });
  }

  // proced to create;
  try {
    const state = await db.client.client.state.create({
      data: {
        ...data,
        alpha2Code: data.alpha2Code.toUpperCase(),
        alpha3Code: data.alpha3Code.toUpperCase(),
        name: utils.text.titleCase(data.name),
      },
      include: db.client.include.state,
    });
    const filtered = await db.client.filterModels([state]);
    return utils.handlers.success(res, {
      message: "state created successfully",
      data: filtered,
      count: 1,
    });
  } catch (err: any) {
    return utils.handlers.error(res, "general", {
      message: err?.message ?? "some error occured",
      data: [{ details: err }],
    });
  }
};

export default create;
