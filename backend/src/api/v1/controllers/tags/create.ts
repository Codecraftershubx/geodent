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
  const description = utils.text.sentenceCase(data.description);
  // avoid duplicate entries
  const existingTag = await db.client.client.amenity.findMany({
    where: {
      name,
      description: data.description,
      isDeleted: false,
    },
  });
  if (existingTag.length) {
    return utils.handlers.error(res, "general", {
      message: "tag already exists",
      status: 400,
    });
  }

  // proceed to create;
  const connectionKeys = ["rooms", "flats", "blocks", "listings"];
  const connect = {} as Record<string, any>;
  for (let key of connectionKeys) {
    if (data[key] && data[key].length) {
      const temp = {
        [key]: {
          connect: data[key].map((id: string) => {
            id;
          }),
        },
      };
      Object.assign(connect, temp);
    }
  }
  try {
    const tag = await db.client.client.tag.create({
      data: { name, description },
      include: {
        rooms: true,
        flats: true,
        blocks: true,
        listings: true,
      },
    });
    const filtered = await db.client.filterModels([tag]);
    return utils.handlers.success(res, {
      message: "tag created successfully",
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
