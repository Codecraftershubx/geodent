import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one country by id
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    const document = await db.client.client.document.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.document,
    });
    count = document.length;
    if (count) {
      filtered = await db.client.filterModels(document);
      return utils.handlers.success(res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `document not found`,
      status: 404,
    });
  }
  // get all countries
  const documents = await db.client.client.document.findMany({
    where: { isDeleted: false },
    include: db.client.include.document,
  });
  filtered = await db.client.filterModels(documents);
  count = documents.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no document created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
