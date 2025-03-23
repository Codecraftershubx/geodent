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
  // avoid duplicate entries
  const width = parseFloat(parseFloat(data.width).toFixed(2));
  const height = parseFloat(parseFloat(data.height).toFixed(2));
  const length = parseFloat(parseFloat(data.length).toFixed(2));
  const number = parseInt(data.number);
  const userId = data.userId;
  const connectionKeys = ["amenities", "documents", "tags"];
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
};

export default create;
