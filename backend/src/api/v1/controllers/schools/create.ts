import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
  // validate sent data
  console.log("create schools controller called");
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
  // verify country
  const country = await db.client.client.country.findMany({
    where: { id: data.countryId },
  });

  if (!country.length) {
    return utils.handlers.error(res, "validation", {
      message: `country ${data.countryId} not found`,
      status: 404,
    });
  }

  // verify state
  const state = await db.client.client.state.findMany({
    where: { id: data.stateId },
  });

  if (!state.length) {
    return utils.handlers.error(res, "validation", {
      message: `state ${data.stateId} not found`,
      status: 404,
    });
  }

  // verify city
  const city = await db.client.client.city.findMany({
    where: { id: data.cityId },
  });

  if (!city.length) {
    return utils.handlers.error(res, "validation", {
      message: `city ${data.cityId} not found`,
      status: 404,
    });
  }
  const name = utils.text.titleCase(data.name);
  // avoid duplicate entries
  const existingSchool = await db.client.client.school.findMany({
    where: {
      name,
      stateId: data.stateId,
      cityId: data.cityId,
      countryId: data.countryId,
    },
  });
  if (existingSchool.length) {
    return utils.handlers.error(res, "general", {
      message: "school already exists",
      status: 400,
    });
  }

  // proceed to create;
  data.type = utils.text.upperCase(data.type);
  try {
    const school = await db.client.client.school.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description || null,
        state: { connect: { id: data.stateId } },
        city: { connect: { id: data.cityId } },
        country: { connect: { id: data.countryId } },
        address: {
          create: {
            street: data.street,
            number: data.number || null,
            poBox: data.poBox || null,
            zip: data.zip,
          },
        },
      },
    });
    return utils.handlers.success(res, {
      message: "school created successfully",
      data: [{ id: school.id }],
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(res, "general", {
      message: err?.message ?? "some error occured",
      data: [{ details: err }],
    });
  }
};

export default create;
