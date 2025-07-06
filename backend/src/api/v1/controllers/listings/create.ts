import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import { ListingProximity, ListingType } from "../../../../utils/types.js";
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
  const type = utils.text.upperCase(data.type) as ListingType;
  const proximity = utils.text.upperCase(data.proximity) as ListingProximity;
  const price = parseFloat(parseFloat(data.price).toFixed(2));
  const rooms = data.rooms || null;
  const flats = data.flats || null;
  const tags = data.tags || null;
  const blocks = data.blocks || null;
  const isAvailable = data.isAvailable || false;
  const shortDescr = data.shortDescr;
  const longDescr = data.longDescr || null;

  // validate country
  const country = await db.client.client.country.findMany({
    where: { id: data.countryId, isDeleted: false },
    include: db.client.include.country,
  });
  if (!country.length) {
    return utils.handlers.error(req, res, "validation", {
      message: `country ${data.countryId} not found`,
      status: 404,
    });
  }

  // validate state
  const state = await db.client.client.state.findMany({
    where: { id: data.stateId, isDeleted: false },
    include: db.client.include.state,
  });
  if (!state.length) {
    return utils.handlers.error(req, res, "validation", {
      message: `state ${data.stateId} not found`,
      status: 404,
    });
  }
  if (state[0].countryId !== country[0].id) {
    return utils.handlers.error(req, res, "validation", {
      message: `state ${data.stateId} not in country ${data.countryId}`,
      status: 404,
    });
  }

  // validate city
  const city = await db.client.client.city.findMany({
    where: { id: data.cityId, isDeleted: false },
    include: db.client.include.city,
  });
  if (!city.length) {
    return utils.handlers.error(req, res, "validation", {
      message: `city ${data.cityId} not found`,
      status: 404,
    });
  }
  if (city[0].stateId !== state[0].id) {
    return utils.handlers.error(req, res, "validation", {
      message: `city ${data.cityId} not in state ${data.stateId}`,
      status: 404,
    });
  }

  // validate school
  const school = await db.client.client.school.findMany({
    where: { id: data.schoolId, isDeleted: false },
    include: db.client.include.school,
  });
  if (!school.length) {
    return utils.handlers.error(req, res, "validation", {
      message: `school ${data.schoolId} not found`,
      status: 404,
    });
  }
  if (school[0].cityId !== city[0].id) {
    return utils.handlers.error(req, res, "validation", {
      message: `school ${data.schoolId} not in city ${data.cityId}`,
      status: 404,
    });
  }

  // validate campus
  if (data.campusId) {
    const campus = await db.client.client.campus.findMany({
      where: { id: data.campusId, isDeleted: false },
    });
    if (!campus.length) {
      return utils.handlers.error(req, res, "validation", {
        message: `campus ${data.campusId} not found`,
        status: 404,
      });
    }
    if (campus[0].schoolId !== school[0].id) {
      return utils.handlers.error(req, res, "validation", {
        message: `campus ${data.campusId} not in school ${data.schoolId}`,
        status: 404,
      });
    }
  }

  // validate user
  const user = await db.client.client.user.findMany({
    where: { id: data.userId, isDeleted: false },
  });
  if (!user.length) {
    return utils.handlers.error(req, res, "validation", {
      message: `user ${data.userId} not found`,
      status: 404,
    });
  }

  // validate tags
  for (let id of tags) {
    const tag = await db.client.client.tag.findMany({
      where: { id, isDeleted: false },
    });
    if (!tag.length) {
      return utils.handlers.error(req, res, "validation", {
        message: `tag ${id} not found`,
        status: 404,
      });
    }
  }

  // validate blocks
  if (blocks) {
    let block;
    for (let id of blocks) {
      block = await db.client.client.block.findMany({
        where: { id, isDeleted: false },
      });
      if (!block.length) {
        return utils.handlers.error(req, res, "validation", {
          message: `block ${id} not found`,
          status: 404,
        });
      }
    }
  }

  // validate rooms
  if (rooms) {
    let room;
    for (let id of rooms) {
      room = await db.client.client.room.findMany({
        where: { id, isDeleted: false },
      });
      if (!room.length) {
        return utils.handlers.error(req, res, "validation", {
          message: `room ${id} not found`,
          status: 404,
        });
      }
    }
  }

  // validate flats
  if (flats) {
    let flat;
    for (let id of flats) {
      flat = await db.client.client.flat.findMany({
        where: { id, isDeleted: false },
      });
      if (!flat.length) {
        return utils.handlers.error(req, res, "validation", {
          message: `room ${id} not found`,
          status: 404,
        });
      }
    }
  }

  // define connections and filters
  const connectionKeys = ["tags", "rooms", "flats", "blocks"];
  const staticFields = [
    "countryId",
    "stateId",
    "cityId",
    "schoolId",
    "userId",
    "campusId",
  ];
  const createData = {
    name,
    type,
    price,
    isAvailable,
    proximity,
    shortDescr,
    longDescr,
  } as Prisma.ListingCreateInput;
  const whereData = {
    name,
    type,
    price,
    isAvailable,
    proximity,
    shortDescr,
    longDescr,
  } as Record<string, any>;
  for (let key of connectionKeys) {
    if (data[key] && data[key].length) {
      const temp = {
        [key]: {
          connect: data[key].map((id: string) => {
            return { id };
          }),
        },
      };
      Object.assign(createData, temp);
    }
  }
  for (let field of staticFields) {
    if (data[field]) {
      Object.assign(whereData, { [field]: data[field] });
      if (field === "countryId") {
        Object.assign(createData, {
          country: { connect: { id: data[field] } },
        });
      } else if (field === "stateId") {
        Object.assign(createData, {
          state: { connect: { id: data[field] } },
        });
      } else if (field === "cityId") {
        Object.assign(createData, {
          city: { connect: { id: data[field] } },
        });
      } else if (field === "campusId") {
        Object.assign(createData, {
          campus: { connect: { id: data[field] } },
        });
      } else if (field === "schoolId") {
        Object.assign(createData, {
          school: { connect: { id: data[field] } },
        });
      } else if (field === "userId") {
        Object.assign(createData, {
          user: { connect: { id: data[field] } },
        });
      }
    }
  }
  // verify no dulicates
  const exitingListing = await db.client.client.listing.findMany({
    where: {
      ...whereData,
      isDeleted: false,
    },
  });
  if (exitingListing.length) {
    return utils.handlers.error(req, res, "general", {
      message: "listing already exists",
      status: 400,
    });
  }

  // proceed to create;
  try {
    const listing = await db.client.client.listing.create({
      data: { ...createData },
      include: db.client.include.listing,
    });

    const filtered = await db.client.filterModels([listing]);
    return utils.handlers.success(req, res, {
      message: "listing created successfully",
      data: filtered,
      status: 201,
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
