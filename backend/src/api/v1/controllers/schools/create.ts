import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import type { SchoolType } from "../../../../utils/types.js";

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

  // validate country
  const country = await db.client.client.country.findMany({
    where: { id: data.countryId },
  });

  if (!country.length) {
    return utils.handlers.error(req, res, "validation", {
      message: `country ${data.countryId} not found`,
      status: 404,
    });
  }

  // validate state
  const state = await db.client.client.state.findMany({
    where: { id: data.stateId },
  });

  if (!state.length) {
    return utils.handlers.error(req, res, "validation", {
      message: `state ${data.stateId} not found`,
      status: 404,
    });
  }
  // validate city
  const city = await db.client.client.city.findMany({
    where: { id: data.cityId },
  });

  if (!city.length) {
    return utils.handlers.error(req, res, "validation", {
      message: `city ${data.cityId} not found`,
      status: 404,
    });
  }

  const name = utils.text.titleCase(data.name);
  const type = utils.text.upperCase(data.type) as SchoolType;
  const description = data.description || null;
  const connection = {
    tags: {
      connect: data.tags.map((id: string) => {
        return { id };
      }),
    },
    country: { connect: { id: data.countryId } },
    state: { connect: { id: data.stateId } },
    city: { connect: { id: data.cityId } },
  };

  // avoid duplicate entries
  const existingSchool = await db.client.client.school.findMany({
    where: {
      name,
      type,
      description,
      isDeleted: false,
    },
  });
  if (existingSchool.length) {
    return utils.handlers.error(req, res, "general", {
      message: "school already exists",
      status: 400,
    });
  }

  // proceed to create;
  const createData = {
    name,
    type,
    description,
    address: {
      create: {
        street: data.street,
        number: data.number || null,
        poBox: data.poBox || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        zip: data.zip,
      },
    },
  } as Prisma.SchoolCreateInput;

  try {
    const school = await db.client.client.school.create({
      data: { ...createData, ...connection },
      include: db.client.include.school,
    });
    const filtered = await db.client.filterModels([school]);
    return utils.handlers.success(req, res, {
      message: "school created successfully",
      data: filtered,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(req, res, "general", {
      message: err?.message ?? "some error occured",
      data: [{ details: err }],
    });
  }
};

export default create;
