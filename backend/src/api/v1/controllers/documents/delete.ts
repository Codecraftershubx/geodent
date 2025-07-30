import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }

  /* ------------TODO------------------- */
  /* - Validate User Owns the Document - */
  /* ----------------------------------- */

  const { id } = req.params;
  try {
    /* ---------------------------- */
    /* - Validate Document Exists - */
    /* ---------------------------- */
    const document = await db.client.client.document.findUnique({
      where: { id, isDeleted: false },
    });
    if (!document) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* ------------------- */
    /* - Delete Document - */
    /* ------------------- */
    await db.client.client.document.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      },
    });
    const trashed = await utils.storage.fileManager.trash(document.localPath);
    if (!trashed) {
      console.error(`trashing ${document.localPath} failed`);
    }
    return utils.handlers.success(req, res, {
      message: "deleted",
      errno: 44,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default deleteDocument;
