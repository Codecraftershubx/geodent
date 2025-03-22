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
  // avoid duplicate entries
  const { data } = matchedData(req);
  const existingCountry = await db.client.client.country.findMany({
    where: { numericCode: data.numericCode },
  });
  if (existingCountry.length) {
    return utils.handlers.error(res, "general", {
      message: "country already exists",
      status: 400,
    });
  }

  // proceed to create;
  try {
    const country = await db.client.client.country.create({
      data: {
        ...data,
        alpha2Code: data.alpha2Code.toUpperCase(),
        alpha3Code: data.alpha3Code.toUpperCase(),
        name: utils.text.titleCase(data.name),
      },
      include: db.client.include.country,
    });
    const filtered = await db.client.filterModels([country]);
    return utils.handlers.success(res, {
      message: "country created successfully",
      data: filtered,
      status: 201,
    });
  } catch (err: any) {
    return utils.handlers.error(res, "general", {
      message: err?.message ?? "some error occured",
      data: [{ details: err }],
    });
  }
};

export default create;
