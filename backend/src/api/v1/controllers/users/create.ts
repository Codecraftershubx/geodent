import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import { matchedData, validationResult } from "express-validator";
import utils from "../../../../utils/index.js";
import type { THandlerOptions } from "../../../../utils/types.js";

const createNewUser = async (req: Request, res: Response): Promise<void> => {
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

  // get data and create user
  const { data } = matchedData(req);
  const connectFields = [
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
    "rooms",
    "flats",
    "blocks",
    "verifications",
  ];
  const createFields = [
    "firstName",
    "lastName",
    "email",
    "isAdmin",
    "phone",
    "role",
  ];

  try {
    const password = await utils.passwords.hash(data.password);
    if (!password) {
      utils.handlers.error(req, res, "general", {
        message: "Sorry, some error occured. Try again later.",
      });
    }
    // construct user create object
    const createData = {} as Record<string, any>;
    for (let key of Object.keys(data)) {
      if (createFields.includes(key)) {
        createData[key] = data[key];
      }
    }
    // define connections
    const connections = { password } as Prisma.UserCreateInput;
    for (let field of connectFields) {
      if (data[field]) {
        Object.assign(connections, {
          [field]: {
            connect: data[field].map((id: string) => {
              return { id };
            }),
          },
        });
      }
    }
    if (data["addressId"]) {
      Object.assign(connections, {
        address: { connect: { id: data["addressId"] } },
      });
    }
    const newUser = await db.client.client.user.create({
      data: {
        ...createData,
        ...connections,
      },
      include: db.client.include.user,
    });
    const filtered = await db.client.filterModels([newUser]);
    return utils.handlers.success(req, res, {
      data: filtered,
      message: "user created successfully",
      status: 201,
    });
  } catch (err: any) {
    console.log(err);
    const resOptions: THandlerOptions = {
      data: [{ details: err?.message ?? err.toString() }],
      message: "user creation failed",
    };
    if (err?.code || null === "P2002") {
      resOptions["status"] = 400;
    }
    return utils.handlers.error(req, res, "general", resOptions);
  }
};

export default createNewUser;
