import { Request, Response } from "express";
import { validationResult } from "express-validator";
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
  const array = req?.files || null;
  if (!array || !Array.isArray(array) || !array.length) {
    return utils.handlers.error(res, "validation", {
      message: "no file uploaded",
    });
  }
  const files = array as Express.Multer.File[];
  const { owner } = req.body;
  const data = req.body;

  // validate owner exists
  const chatroom = data.chatroom
    ? await db.client.client.chatroom.findUnique({
        where: { id: data.chatroom[0] },
      })
    : null;
  const listing = data.listing
    ? await db.client.client.listing.findUnique({
        where: { id: data.listing[0] },
      })
    : null;
  const user = data.user
    ? await db.client.client.user.findUnique({ where: { id: data.user[0] } })
    : null;
  const verification = data.verification
    ? await db.client.client.verification.findUnique({
        where: { id: data.verification[0] },
      })
    : null;
  const room = data.room
    ? await db.client.client.room.findUnique({ where: { id: data.room[0] } })
    : null;
  const flat = data.flat
    ? await db.client.client.flat.findUnique({ where: { id: data.flat[0] } })
    : null;
  const block = data.block
    ? await db.client.client.block.findUnique({
        where: { id: data.block[0] },
      })
    : null;
  const school = data.school
    ? await db.client.client.school.findUnique({
        where: { id: data.school[0] },
      })
    : null;
  const campus = data.campus
    ? await db.client.client.campus.findUnique({
        where: { id: data.campus[0] },
      })
    : null;
  const city = data.city
    ? await db.client.client.city.findUnique({ where: { id: data.city[0] } })
    : null;
  const country = data.country
    ? await db.client.client.country.findUnique({
        where: { id: data.country[0] },
      })
    : null;
  const state = data.state
    ? await db.client.client.state.findUnique({
        where: { id: data.state[0] },
      })
    : null;

  if (
    !chatroom &&
    !listing &&
    !user &&
    !verification &&
    !room &&
    !flat &&
    !block &&
    !school &&
    !campus &&
    !city &&
    !country &&
    !state
  ) {
    return utils.handlers.error(res, "validation", {
      message: `owner ${owner} not found`,
    });
  }
  // try creating files
  try {
    const createdDocs = await db.client.client.$transaction(async () => {
      const created = [];
      // iterate through files and create each one
      for (let file of files) {
        const fileName = file?.originalname;
        const mimeType = file?.mimetype;
        const localPath = file?.path;
        const fileSize = file?.size;
        // verify file doesn't already exist
        const existingDocument = await db.client.client.document.findMany({
          where: {
            fileName,
            fileSize,
            localPath,
            mimeType,
            owner,
          },
        });
        if (existingDocument.length) {
          throw new Error("document already exists");
        }
        // define connection based on ownerId
        const connect = chatroom
          ? { chatroom: { connect: { id: data.chatroomId } } }
          : listing
            ? { listing: { connect: { id: data.listingId } } }
            : user
              ? { user: { connect: { id: data.userId } } }
              : verification
                ? { verification: { connect: { id: data.verificationId } } }
                : room
                  ? { room: { connect: { id: data.roomId } } }
                  : flat
                    ? { flat: { connect: { id: data.flatId } } }
                    : block
                      ? { block: { connnect: { id: data.blockId } } }
                      : school
                        ? { school: { connect: { id: data.schoolId } } }
                        : campus
                          ? { campus: { connect: { id: data.campusId } } }
                          : city
                            ? { city: { connect: { id: data.cityId } } }
                            : country
                              ? { country: { connect: { id: data.countryId } } }
                              : state
                                ? { state: { connect: { id: data.stateId } } }
                                : null;

        let createData = {
          fileName,
          fileSize,
          localPath,
          mimeType,
          owner,
          ...connect,
        } as Prisma.DocumentCreateInput;

        const newDocument = await db.client.client.document.create({
          data: createData,
        });
        // add new document to created Documents array
        created.push(newDocument);
      }
      return created;
    });
    const count = files.length;
    return utils.handlers.success(res, {
      message: `document${count > 1 ? "s" : ""} created successfully`,
      status: 201,
      data: createdDocs,
      count,
    });
  } catch (err: any) {
    return utils.handlers.error(res, "general", {
      message: err?.message ?? "some error occured",
      data: [{ details: err }],
    });
  }
};

export default create;
