import { NextFunction, Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";
import config from "../../../../config.js";

const read = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // get one country by id
  const { id } = req.params;
  const { download } = req.query;

  const document = await db.client.client.document.findMany({
    where: { isDeleted: false, id },
    include: db.client.include.document,
  });

  if (!document.length) {
    return utils.handlers.error(res, "general", {
      message: `file ${id} not found`,
      status: 404,
      count: 0,
      data: [],
    });
  }

  // send file
  const file = document[0];
  const options: Record<string, any> = {
    lastModified: false,
    dotfiles: "deny",
    headers: {
      "Content-Type": file.mimeType,
    },
  };
  if (download) {
    if (!file.isDownloadable) {
      return utils.handlers.error(res, "validation", {
        message: `denied. not downloadable`,
        status: 401,
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
      console.log(
        `file ${id} ${download ? "downloaded" : "sent"} successfully`,
      );
    }
  });
  return;
};

export default read;
