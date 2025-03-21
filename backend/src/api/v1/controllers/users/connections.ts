import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const updateConnections = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { id } = req.params;
  const { data } = matchedData(req);
  const connections = [
    "documents",
    "chatrooms",
    "likes",
    "likedBy",
    "listings",
    "notifications",
    "tenancy",
    "rentals",
    "reviews",
    "receivedReviews",
    "messages",
    "rooms",
    "flats",
    "blocks",
    "verifications",
  ];
  const connectObject = {} as Prisma.UserUpdateInput;
  const { extend } = req.query;

  // verify user exists
  const user = await db.client.client.user.findMany({
    where: { id, isDeleted: false },
  });
  if (!user.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `user not found`,
    });
  }
  // construct update object for vector fields
  for (let field of connections) {
    // [UPDATE!!] check if each id provided is valid
    if (data[field]) {
      if (extend) {
        Object.assign(connectObject, {
          [field]: {
            connect: data[field].map((id: string) => {
              return { id };
            }),
          },
        });
      } else {
        Object.assign(connectObject, {
          [field]: {
            disconnect: data[field].map((id: string) => {
              return { id };
            }),
          },
        });
      }
    }
  }
  // handle scalar fields (address)
  if (data.address && data.address.length) {
    if (extend) {
      Object.assign(connectObject, {
        address: { connect: { id: data.address[0] } },
      });
    } else {
      Object.assign(connectObject, {
        address: { disconnect: { id: data.address[0] } },
      });
    }
  }
  // update user
  try {
    let updated = await db.client.client.user.update({
      where: { id },
      data: { ...connectObject },
      include: db.client.include.user,
    });
    const filtered = await db.client.filterModels([updated]);
    return utils.handlers.success(res, {
      message: "update successful",
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    console.log(err);
    return utils.handlers.error(res, "general", {
      message: err?.message ?? err.toString(),
      data: [{ details: err }],
    });
  }
};

export default updateConnections;
