import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import config from "../../../../config.js";
import utils from "../../../../utils/index.js";

const restoreDocument = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify amenity exists
  const document = await db.client.client.document.findMany({
    where: { id, isDeleted: true },
  });
  if (!document.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `document not found`,
    });
  }
  // delete amenity
  await db.client.client.document.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  const filepath = document[0].localPath.split("/");
  const filename = filepath[filepath.length - 1];
  const dest = document[0].localPath;
  const source = `${config.trashPath}/${filename}`;
  const restored = await utils.storage.fileManager.move(source, dest);
  if (!restored) {
    console.error(`restoring ${filename} failed`);
  }
  return utils.handlers.success(res, {
    message: "document restored successfully",
    count: 1,
  });
};

export default restoreDocument;
