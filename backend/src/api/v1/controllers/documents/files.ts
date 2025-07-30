import { NextFunction, Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import config from "../../../../config.js";

const read = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { download } = req.query;

  /* ---------------------------- */
  /* - Validate Document Exists - */
  /* ---------------------------- */
  try {
    const document = await db.client.client.document.findUnique({
      where: { isDeleted: false, id },
      include: db.client.include.document,
    });

    if (!document) {
      return utils.handlers.error(req, res, "general", {
        message: `file ${id} not found`,
        errno: 13,
      });
    }

    /* ------------- */
    /* - Send file - */
    /* ------------- */
    const file = document;
    const options: Record<string, any> = {
      lastModified: false,
      dotfiles: "deny",
      headers: {
        "Content-Type": file.mimeType,
      },
    };
    if (download) {
      if (!file.isDownloadable) {
        return utils.handlers.error(req, res, "validation", {
          message: `denied. not downloadable`,
          errno: 31,
        });
      }
      options.headers["Content-Disposition"] =
        `attachment; filename="${file.originalName}"`;
    }
    const path = `${config.basePath}/${file.fileName}`;
    res.sendFile(path, options, (err) => {
      if (err) {
        console.error(`error fetching file ${id}`);
        next(err);
      } else {
        console.log(`file ${id} ${download ? "downloaded" : "sent"}`);
      }
    });
    return;
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default read;
