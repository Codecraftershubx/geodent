import { Prisma } from "@prisma/client";
import config from "../../../../config.js";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import type { DocumentOwner } from "../../../../utils/types.js";

const create = async ({
  files,
  data,
}: {
  files: Express.Multer.File[];
  data: Record<string, any>;
}): Promise<Record<string, any>> => {
  // validate sent data
  if (!files || !files.length) {
    return {
      error: true,
      details: {
        message: "no file provided",
        status: 400,
        type: "validation",
      },
    };
  }
  const owner = data.owner as DocumentOwner;
  // validate owner exists
  const chatroom = data.chatroom
    ? await db.client.client.chatroom.findUnique({
        where: { id: data.chatroom },
      })
    : null;
  const listing = data.listing
    ? await db.client.client.listing.findUnique({
        where: { id: data.listing },
      })
    : null;
  const user = data.user
    ? await db.client.client.user.findUnique({ where: { id: data.user } })
    : null;
  const verification = data.verification
    ? await db.client.client.verification.findUnique({
        where: { id: data.verification },
      })
    : null;
  const room = data.room
    ? await db.client.client.room.findUnique({ where: { id: data.room } })
    : null;
  const flat = data.flat
    ? await db.client.client.flat.findUnique({ where: { id: data.flat } })
    : null;
  const block = data.block
    ? await db.client.client.block.findUnique({
        where: { id: data.block },
      })
    : null;
  const school = data.school
    ? await db.client.client.school.findUnique({
        where: { id: data.school },
      })
    : null;
  const campus = data.campus
    ? await db.client.client.campus.findUnique({
        where: { id: data.campus },
      })
    : null;
  const city = data.city
    ? await db.client.client.city.findUnique({ where: { id: data.city } })
    : null;
  const country = data.country
    ? await db.client.client.country.findUnique({
        where: { id: data.country },
      })
    : null;
  const state = data.state
    ? await db.client.client.state.findUnique({
        where: { id: data.state },
      })
    : null;
  const message = data.message
    ? await db.client.client.message.findUnique({
        where: { id: data.message },
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
    !state &&
    !message
  ) {
    return {
      error: true,
      details: {
        type: "validation",
        message: `${owner} ${data[utils.text.lowerCase(owner)]} not found`,
        status: 404,
      },
    };
  }
  // try creating files
  try {
    const createdDocs = await db.client.client.$transaction(async () => {
      const created = [];
      const isDownloadable = data?.isDownloadable === "true" ? true : false;
      // iterate through files and create each one
      for (let file of files) {
        const originalName = file?.originalname;
        const fileName = file?.filename;
        const mimeType = file?.mimetype;
        const localPath = file?.path;
        const fileSize = file?.size;
        // verify file doesn't already exist
        const existingDocument = await db.client.client.document.findMany({
          where: {
            originalName,
            fileName,
            fileSize,
            localPath,
            mimeType,
            owner,
            isDownloadable,
          },
        });
        if (existingDocument.length) {
          throw new Error("document already exists");
        }
        // define connection based on ownerId
        const connect = chatroom
          ? { chatroom: { connect: { id: data.chatroom } } }
          : listing
            ? { listing: { connect: { id: data.listing } } }
            : user
              ? { user: { connect: { id: data.user } } }
              : verification
                ? { verification: { connect: { id: data.verification } } }
                : room
                  ? { room: { connect: { id: data.room } } }
                  : flat
                    ? { flat: { connect: { id: data.flat } } }
                    : block
                      ? { block: { connnect: { id: data.block } } }
                      : school
                        ? { school: { connect: { id: data.school } } }
                        : campus
                          ? { campus: { connect: { id: data.campus } } }
                          : city
                            ? { city: { connect: { id: data.city } } }
                            : country
                              ? { country: { connect: { id: data.country } } }
                              : state
                                ? { state: { connect: { id: data.state } } }
                                : message
                                  ? {
                                      message: {
                                        connect: { id: data.message },
                                      },
                                    }
                                  : null;

        let createData = {
          originalName,
          fileName,
          fileSize,
          localPath,
          mimeType,
          owner,
          isDownloadable,
          ...connect,
        } as Prisma.DocumentCreateInput;

        // create new document
        const newDocument = await db.client.client.document.create({
          data: createData,
        });

        // update urls
        const fallbackUrl = `${config.hostname}/api/v1/documents/static/${newDocument.id}`;
        const downloadUrl = `${fallbackUrl}?download=true`;
        const updated = await db.client.client.document.update({
          where: { id: newDocument.id },
          data: { downloadUrl, fallbackUrl },
        });
        // add new document to created Documents array
        created.push(updated);
      }
      return created;
    });
    const count = files.length;
    const filtered = await db.client.filterModels(createdDocs);
    return {
      error: false,
      data: {
        message: `document${count > 1 ? "s" : ""} created successfully`,
        status: 201,
        data: filtered,
        count,
      },
    };
  } catch (err: any) {
    return {
      error: true,
      details: {
        type: "general",
        message: err?.message ?? "some error occured",
        data: [{ details: err }],
      },
    };
  }
};

export default create;
