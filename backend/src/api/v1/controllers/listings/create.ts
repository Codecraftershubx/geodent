import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
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
  const name = utils.text.titleCase(data.name);
  const type = utils.text.upperCase(data.type);
  const proximity = utils.text.upperCase(data.proximity);
  const price = parseFloat(parseFloat(data.price).toFixed(2));
  const amenities = [];
  const rooms = data.rooms || null;
  const flats = data.flats || null;
  const tags = data.tags || null;
  const blocks = data.blocks || null;

  // validate country
  const country = await db.client.client.country.findMany({
    where: { id: data.countryId, isDeleted: false },
    include: db.client.include.country,
  });
  if (!country.length) {
    return utils.handlers.error(res, "validation", {
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
    return utils.handlers.error(res, "validation", {
      message: `state ${data.stateId} not found`,
      status: 404,
    });
  }
  if (state[0].countryId !== country[0].id) {
    return utils.handlers.error(res, "validation", {
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
    return utils.handlers.error(res, "validation", {
      message: `city ${data.cityId} not found`,
      status: 404,
    });
  }
  if (city[0].stateId !== state[0].id) {
    return utils.handlers.error(res, "validation", {
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
    return utils.handlers.error(res, "validation", {
      message: `school ${data.schoolId} not found`,
      status: 404,
    });
  }
  if (school[0].cityId !== city[0].id) {
    return utils.handlers.error(res, "validation", {
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
      return utils.handlers.error(res, "validation", {
        message: `campus ${data.campusId} not found`,
        status: 404,
      });
    }
    if (campus[0].schoolId !== school[0].id) {
      return utils.handlers.error(res, "validation", {
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
    return utils.handlers.error(res, "validation", {
      message: `user ${data.userId} not found`,
      status: 404,
    });
  }
  // vali date tags
  for (let id of tags) {
    const tag = await db.client.client.tag.findMany({
      where: { id, isDeleted: false },
    });
    if (!tag.length) {
      return utils.handlers.error(res, "validation", {
        message: `tag ${id} not found`,
        status: 404,
      });
    }
  }
  // validate blocks

  // validate rooms
  if (rooms) {
    let room;
    for (let id of rooms) {
      room = await db.client.client.room.findMany({
        where: { id, isDeleted: false },
      });
      if (!room.length) {
        return utils.handlers.error(res, "validation", {
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
        return utils.handlers.error(res, "validation", {
          message: `room ${id} not found`,
          status: 404,
        });
      }
    }
  }
  // avoid duplicate entries
  /*
  const connectionKeys = [
    "amenities",
    "documents",
    "tags",
    "rooms",
    "flats",
    "blocks",
  ];
  const connection = {} as Prisma.RoomCreateInput;
  for (let key of connectionKeys) {
    if (data[key] && data[key].length) {
      const temp = {
        [key]: {
          connect: data[key].map((id: string) => {
            return { id };
          }),
        },
      };
      Object.assign(connection, temp);
    }
  }
  const roomData: Prisma.RoomCreateInput = {
    width,
    height,
    length,
    number,
    landlord: { connect: { id: userId } },
  };
  const optionalFields = ["addressId", "listingId", "flatId", "blockId"];
  const whereData = {} as Record<string, any>;
  for (let field of optionalFields) {
    if (data[field]) {
      Object.assign(roomData, { [field]: data[field] });
      Object.assign(whereData, { [field]: data[field] });
    }
  }
  const existingRoom = await db.client.client.room.findMany({
    where: {
      width,
      height,
      length,
      number,
      userId,
      ...whereData,
      isDeleted: false,
    },
  });
  if (existingRoom.length) {
    return utils.handlers.error(res, "general", {
      message: "room already exists",
      status: 400,
    });
  }

  // proceed to create;
  try {
    const room = await db.client.client.room.create({
      data: { ...roomData, ...connection },
      include: db.client.include.room,
    });
    const filtered = await db.client.filterModels([room]);
    return utils.handlers.success(res, {
      message: "room created successfully",
      data: filtered,
      status: 201,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(res, "general", {
      message: err?.message ?? "some error occured",
      data: [{ details: err }],
    });
  }
  */
  res.json({ success: true });
  return;
};

export default create;
