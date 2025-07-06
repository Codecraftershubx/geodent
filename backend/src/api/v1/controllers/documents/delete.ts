import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify amenity exists
  const document = await db.client.client.document.findMany({
    where: { id, isDeleted: false },
  });
  if (!document.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `document not found`,
    });
  }
  // delete amenity
  await db.client.client.document.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    },
  });
  const trashed = await utils.storage.fileManager.trash(document[0].localPath);
  if (!trashed) {
    console.error(`trashing ${document[0].localPath} failed`);
  }
  return utils.handlers.success(req, res, {
    message: "document deleted",
    count: 1,
  });
};

export default deleteDocument;
