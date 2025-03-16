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
  const { zip, street } = data;

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

  // verify at least one is provided
  if (!flat && !user && !school && !campus && !room && !block) {
    return utils.handlers.error(res, "validation", {
      message: "address needs one of flat, user, school, campus, room or block",
    });
  }

  let addressId = flat
    ? flat.addressId
    : user
      ? user.addressId
      : school
        ? school.addressId
        : campus
          ? campus.addressId
          : room
            ? room.addressId
            : block
              ? block.addressId
              : null;

  if (!addressId) {
    return utils.handlers.error(res, "validation", {
      message: "address needs one of flat, user, school, campus, room or block",
    });
  }

  // obtain the db entries from db arrays
  const existingAddress = await db.client.client.address.findMany({
    where: {
      zip,
      street,
      poBox: data?.poBox ?? null,
      latitude: data?.latitude ?? null,
      longitude: data?.longitude ?? null,
      isDeleted: false,
      id: addressId,
    },
  });
  if (existingAddress.length) {
    return utils.handlers.error(res, "general", {
      message: "address already exists",
      status: 400,
    });
  }

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
    street,
    poBox: data?.poBox ?? null,
    latitude: data?.latitude ?? null,
    longitude: data?.longitude ?? null,
  };

  if (connect) {
    data.connect = connect;
  }

  // proceed to create;
  try {
    const address = await db.client.client.address.create({
      data: createData,
    });
    return utils.handlers.success(res, {
      message: "address created successfully",
      data: [{ id: address.id }],
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
