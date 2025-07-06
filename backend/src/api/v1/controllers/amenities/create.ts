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
  const name = utils.text.titleCase(data.name);
  // avoid duplicate entries
  const existingAmenity = await db.client.client.amenity.findMany({
    where: {
      name,
      isDeleted: false,
    },
  });
  if (existingAmenity.length) {
    return utils.handlers.error(req, res, "general", {
      message: "amenity already exists",
      status: 400,
    });
  }

  // proced to create;
  try {
    const amenity = await db.client.client.amenity.create({
      data: { ...data, name },
    });
    return utils.handlers.success(req, res, {
      message: "amenity created successfully",
      data: [{ id: amenity.id }],
      status: 201,
    });
  } catch (err: any) {
    return utils.handlers.error(req, res, "general", {
      message: err?.message ?? "some error occured",
      data: [{ details: err }],
    });
  }
};

export default create;
