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
  const userId = data.userId;
  const connectionKeys = ["rooms", "amenities", "documents", "tags"];
  const optionalFields = [
    "addressId",
    "listingId",
    "blockId",
    "isStandAlone",
    "isComposite",
  ];
  const dataFields = Object.keys(data);
  const whereData = {} as Record<string, any>;
  const flatData: Prisma.FlatCreateInput = {
    landlord: { connect: { id: userId } },
  };

  for (let field of optionalFields) {
    if (dataFields.includes(field)) {
      Object.assign(whereData, { [field]: data[field] });
      if (field === "addressId") {
        Object.assign(flatData, { address: { connect: { id: data[field] } } });
      } else if (field === "listingId") {
        Object.assign(flatData, { listing: { connect: { id: data[field] } } });
      } else if (field === "blockId") {
        Object.assign(flatData, { block: { connect: { id: data[field] } } });
      } else {
        Object.assign(flatData, { [field]: data[field] });
      }
    }
  }
  // avoid duplicate flats
  const existingFlat = await db.client.client.flat.findMany({
    where: {
      userId,
      ...whereData,
      isDeleted: false,
    },
  });
  if (existingFlat.length) {
    return utils.handlers.error(res, "general", {
      message: "flat already exists",
      status: 400,
    });
  }
  // prepare for creating new flat
  const connection = {} as Prisma.FlatCreateInput;
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

  // proceed to create;
  try {
    const flat = await db.client.client.flat.create({
      data: { ...flatData, ...connection },
      include: {
        amenities: true,
        documents: true,
        landlord: true,
        tags: true,
        listing: true,
        rooms: true,
        block: true,
        address: true,
      },
    });
    const filtered = await db.client.filterModels([flat]);
    return utils.handlers.success(res, {
      message: "flat created successfully",
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
