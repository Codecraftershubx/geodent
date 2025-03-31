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
  const { number, zip, street, cityId, stateId, countryId } = data;

  // verify flat, user, school, campus, room, block
  // read from db
  const dbFlat = data.flatId
    ? await db.client.client.flat.findMany({ where: { id: data.flatId } })
    : null;
  const dbUser = data.userId
    ? await db.client.client.user.findMany({ where: { id: data.userId } })
    : null;
  const dbSchool = data.schoolId
    ? await db.client.client.school.findMany({ where: { id: data.schoolId } })
    : null;
  const dbCampus = data.campusId
    ? await db.client.client.campus.findMany({ where: { id: data.campusId } })
    : null;
  const dbRoom = data.roomId
    ? await db.client.client.room.findMany({ where: { id: data.roomId } })
    : null;
  const dbBlock = data.blockId
    ? await db.client.client.block.findMany({ where: { id: data.blockId } })
    : null;

  const flat = dbFlat && dbFlat.length ? dbFlat[0] : null;
  const user = dbUser && dbUser.length ? dbUser[0] : null;
  const school = dbSchool && dbSchool.length ? dbSchool[0] : null;
  const campus = dbCampus && dbCampus.length ? dbCampus[0] : null;
  const room = dbRoom && dbRoom.length ? dbRoom[0] : null;
  const block = dbBlock && dbBlock.length ? dbBlock[0] : null;

  if (
    (data.flatId && !flat) ||
    (data.userId && !user) ||
    (data.schoolId && !school) ||
    (data.campusId && !campus) ||
    (data.roomId && !room) ||
    (data.blockId && !block)
  ) {
    return utils.handlers.error(res, "validation", {
      message: "owner not found",
      status: 404,
    });
  }
  // validate city, state, country
  const city = await db.client.client.city.findUnique({
    where: { id: cityId, isDeleted: false },
  });
  if (!city) {
    return utils.handlers.error(res, "validation", {
      message: `city ${cityId} not found`,
      status: 404,
    });
  }

  const state = await db.client.client.state.findUnique({
    where: { id: stateId, isDeleted: false, cities: { some: { id: cityId } } },
  });
  if (!state) {
    return utils.handlers.error(res, "validation", {
      message: `state: ${stateId} not found or city{cityId} not in state`,
      status: 404,
    });
  }

  const country = await db.client.client.country.findUnique({
    where: { id: countryId, states: { some: { id: stateId } } },
  });
  if (!country) {
    return utils.handlers.error(res, "validation", {
      message: `country ${countryId} not found or state ${stateId} not in country`,
    });
  }

  // obtain the db entries from db arrays
  const existingAddress = await db.client.client.address.findMany({
    where: {
      zip,
      number,
      street,
      poBox: data?.poBox ?? null,
      latitude: data?.latitude ?? null,
      longitude: data?.longitude ?? null,
      isDeleted: false,
      cityId,
      stateId,
      countryId,
    },
  });
  if (existingAddress.length) {
    return utils.handlers.error(res, "general", {
      message: "address already exists",
      status: 400,
    });
  }

  // define connection
  const connect = data.flatId
    ? { flat: { connect: { id: data.flatId } } }
    : data.userId
      ? { user: { connect: { id: data.userId } } }
      : data.schoolId
        ? { school: { connect: { id: data.schoolId } } }
        : data.campusId
          ? { campus: { connect: { id: data.campusId } } }
          : data.roomId
            ? { room: { connect: { id: data.roomId } } }
            : data.blockId
              ? { block: { connect: { id: data.blockId } } }
              : null;

  const createData = {
    zip,
    number,
    street,
    poBox: data?.poBox ?? null,
    latitude: data?.latitude ?? null,
    longitude: data?.longitude ?? null,
  };

  if (connect) {
    Object.assign(createData, connect);
  }

  Object.assign(createData, {
    city: { connect: { id: cityId } },
    state: { connect: { id: stateId } },
    country: { connect: { id: country } },
  });

  // proceed to create;
  try {
    const address = await db.client.client.address.create({
      data: createData,
    });
    const filtered = await db.client.filterModels([address]);
    return utils.handlers.success(res, {
      message: "address created successfully",
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
