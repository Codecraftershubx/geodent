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
  const chatroom = data.chatroomId
    ? await db.client.client.chatroom.findUnique({
        where: { id: data.chatroomId },
      })
    : null;
  const listing = data.listingId
    ? await db.client.client.listing.findUnique({
        where: { id: data.listingId },
      })
    : null;
  const user = data.userId
    ? await db.client.client.user.findUnique({ where: { id: data.userId } })
    : null;
  const verification = data.verificationId
    ? await db.client.client.verification.findUnique({
        where: { id: data.verificationId },
      })
    : null;
  const room = data.roomId
    ? await db.client.client.room.findUnique({ where: { id: data.roomId } })
    : null;
  const flat = data.flatId
    ? await db.client.client.flat.findUnique({ where: { id: data.flat } })
    : null;
  const block = data.blockId
    ? await db.client.client.block.findUnique({
        where: { id: data.blockId },
      })
    : null;
  const school = data.schoolId
    ? await db.client.client.school.findUnique({
        where: { id: data.schoolId },
      })
    : null;
  const campus = data.campusId
    ? await db.client.client.campus.findUnique({
        where: { id: data.campusId },
      })
    : null;
  const city = data.cityId
    ? await db.client.client.city.findUnique({ where: { id: data.cityId } })
    : null;
  const country = data.countryId
    ? await db.client.client.country.findUnique({
        where: { id: data.countryId },
      })
    : null;
  const state = data.stateId
    ? await db.client.client.state.findUnique({
        where: { id: data.stateId },
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
