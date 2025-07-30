import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../../db/utils/index.js";
import utils from "../../../../../utils/index.js";
import services from "../../services/index.js";
import type { TErrorNumberType } from "../../../../../config.js";
import multer from "multer";

const create = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }

  /* ----------------------- */
  /* - Validate sent data - */
  /* ---------------------- */
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      errno: 11,
      data: validationErrors,
      count: validationErrors.length,
    });
  }
  try {
    const { id } = req.params;
    let filtered;
    /* ---------------------------- */
    /* - Validate Chatroom Exists - */
    /* ---------------------------- */
    const chatroom = await db.client.client.chatroom.findUnique({
      where: { id, isDeleted: false },
      include: db.client.include.chatroom,
    });
    if (!chatroom) {
      return utils.handlers.error(req, res, "validation", {
        message: `chatroom doesn't exist`,
        errno: 13,
      });
    }

    /* ------------- TODO ---------------------- *
     * - Validate User is chatroom participant - *
     * ----------------------------------------- */

    const senderId: string | null = req.body?.senderId ?? null;
    const text: string | null = req?.body?.text ?? null;
    const filesArray = req?.files ?? null;
    /* Validate text and/or files were sent in message */
    if (
      !text &&
      (!filesArray || !Array.isArray(filesArray) || !filesArray.length)
    ) {
      return utils.handlers.error(req, res, "validation", {
        message: "no data sent'",
        errno: 21,
      });
    }
    /* ----------------------------- *
     * - Prepare to Create Message - *
     * ----------------------------- */
    const filesCount = filesArray ? (filesArray.length as number) : 0;
    const createData = {
      chatroom: { connect: { id } },
      sender: { connect: { id: senderId } },
    } as Prisma.MessageCreateInput;
    /*
     * Create an array of texts that match the length of
     * files + 1 text.
     * The least message text is going to be 1. Other
     * messages may not have texts, but only files.
     */
    const messageTexts: Array<string | null> = [text];
    for (let i = 0; i < filesCount; i++) {
      messageTexts.push(null);
    }
    let newMessage, updatedMessage, document;
    /*
     * Handle Message +? Document(s) creation in a transaction
     * The whole transaction fails to commit unless all ops
     * are successful
     */
    const messages = await db.client.client.$transaction(async () => {
      const newData = messageTexts.map(
        async (txt: string | null, idx: number) => {
          /* -------------------- *
           * Create new Message - *
           * -------------------- */
          newMessage = await db.client.client.message.create({
            data: { ...createData, content: txt },
            include: db.client.include.message,
          });
          /* -------------------------------------- *
           * Link Message and File if file exists - *
           * -------------------------------------- */
          if (filesArray) {
            req.body.message = newMessage.id;
            req.body.isDownloadable = "true";
            document = await services.documents.create({
              data: req.body,
              files: [(filesArray as Express.Multer.File[])[idx]],
            });
            if (document.error || !document.details.data) {
              throw document.details;
            }
            updatedMessage = await db.client.client.message.update({
              where: { id: newMessage.id },
              data: {
                document: {
                  connect: {
                    id: document.details.data[0].id,
                  },
                },
              },
              include: db.client.include.message,
            });
            return updatedMessage;
          } else {
            return newMessage;
          }
        }
      );
      return await Promise.all(newData);
    });
    filtered = await db.client.filterModels(messages);
    const count = filtered.length;
    return utils.handlers.success(req, res, {
      message: `${count} message${count ? "s" : ""} created}`,
      status: 201,
    });
  } catch (err: any) {
    console.error(err);
    const errType: TErrorNumberType = err?.type ?? "general";
    const excluded = ["type"];
    const errData: Record<string, any> = {};
    for (let [key, value] of Object.entries(err)) {
      if (!excluded.includes(key)) {
        errData[key] = value;
      }
    }
    return utils.handlers.error(req, res, errType, errData);
  }
};

export default create;
