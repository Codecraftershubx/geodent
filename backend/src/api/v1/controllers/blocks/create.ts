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
  const connectionKeys = ["rooms", "amenities", "documents", "tags", "flats"];
  const optionalFields = ["addressId", "listingId", "isComposite"];
  const dataFields = Object.keys(data);
  const whereData = {} as Record<string, any>;
  const blockData: Prisma.BlockCreateInput = {
    landlord: { connect: { id: userId } },
    type: data.type,
  };

  for (let field of optionalFields) {
    if (dataFields.includes(field)) {
      Object.assign(whereData, { [field]: data[field] });
      if (field === "addressId") {
        Object.assign(blockData, { address: { connect: { id: data[field] } } });
      } else if (field === "listingId") {
        Object.assign(blockData, { listing: { connect: { id: data[field] } } });
      } else {
        Object.assign(blockData, { [field]: data[field] });
      }
    }
  }
  // avoid duplicate blocks
  const existingBlock = await db.client.client.block.findMany({
    where: {
      userId,
      ...whereData,
      isDeleted: false,
    },
  });
  if (existingBlock.length) {
    return utils.handlers.error(res, "general", {
      message: "block already exists",
      status: 400,
    });
  }
  // prepare for creating new block
  const connection = {} as Prisma.BlockCreateInput;
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
    const block = await db.client.client.block.create({
      data: { ...blockData, ...connection },
      include: {
        amenities: true,
        documents: true,
        landlord: true,
        tags: true,
        listing: true,
        rooms: true,
        flats: true,
        address: true,
      },
    });
    const filtered = await db.client.filterModels([block]);
    return utils.handlers.success(res, {
      message: "block created successfully",
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
