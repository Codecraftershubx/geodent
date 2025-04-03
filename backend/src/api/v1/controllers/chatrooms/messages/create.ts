import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../../db/utils/index.js";
import utils from "../../../../../utils/index.js";
import services from "../../services/index.js";

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

  const { id } = req.params;
  let filtered;
  // verify chatroom
  const chatroom = await db.client.client.chatroom.findUnique({
    where: { id, isDeleted: false },
    include: db.client.include.chatroom,
  });
  if (!chatroom) {
    return utils.handlers.error(res, "general", {
      message: `chatroom not found`,
      status: 404,
    });
  }

  // create chatroom message
  try {
    // create chatroom message
    const senderId = req.body?.senderId ?? null;
    const content = req?.body?.content ?? null;
    const filesArray = req?.files ?? null;
    if (
      !content &&
      (!filesArray || !Array.isArray(filesArray) || !filesArray.length)
    ) {
      return utils.handlers.error(res, "validation", {
        message: "message requires 'content' and/or 'files'",
      });
    }
    if (filesArray && (filesArray.length as number) > 1) {
      return utils.handlers.error(res, "validation", {
        message: "message document can only be 1",
      });
    }
    const createData = {
      chatroom: { connect: { id } },
      sender: { connect: { id: senderId } },
      content: content || null,
    } as Prisma.MessageCreateInput;

    // create message
    const message = await db.client.client.$transaction(async () => {
      const newData = [];
      const newMessage = await db.client.client.message.create({
        data: createData,
        include: db.client.include.message,
      });
      // create document if sent
      if (filesArray && filesArray.length) {
        req.body.message = newMessage.id;
        req.body.isDownloadable = "true";
        const files = filesArray as Express.Multer.File[];
        const document = await services.documents.create({
          files,
          data: req.body,
        });
        if (document.error) {
          throw document.details;
        }
        // update message document
        const updatedMessage = await db.client.client.message.update({
          where: { id: newMessage.id },
          data: {
            document: {
              connect: {
                id: document.data.data[0].id,
              },
            },
          },
          include: db.client.include.message,
        });
        newData.push(updatedMessage);
      }
      if (!newData.length) {
        newData.push(newMessage);
      }
      return newData;
    });
    // return created message with/without document
    filtered = await db.client.filterModels(message);
    return utils.handlers.success(res, {
      message: "message created successfully",
      count: 1,
      data: filtered,
      status: 201,
    });
  } catch (err: any) {
    console.error(err);
    const errData: Record<string, any> = {
      message: err?.message ?? "an error occured",
    };
    if (err?.data || null) {
      errData.data = err.data;
    }
    return utils.handlers.error(res, `${err?.type ?? "general"}`, {
      message: err?.message ?? "an error occured",
    });
  }
};

export default create;
