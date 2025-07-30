import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import config from "../../../../config.js";
import utils from "../../../../utils/index.js";

const restoreDocument = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  try {
    /* ------------------------------------------- */
    /* - Validate Document Exists and is Deleted - */
    /* ------------------------------------------- */
    const document = await db.client.client.document.findUnique({
      where: { id, isDeleted: true },
    });
    if (!document) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* -------------------- */
    /* - Restore Document - */
    /* -------------------- */
    await db.client.client.document.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    const filepath = document.localPath.split("/");
    const filename = filepath[filepath.length - 1];
    const dest = document.localPath;
    const source = `${config.trashPath}/${filename}`;
    const restored = await utils.storage.fileManager.move(source, dest);
    if (!restored) {
      console.error(`restoring ${filename} failed`);
    }
    return utils.handlers.success(req, res, {
      message: "document restored",
      count: 1,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default restoreDocument;
