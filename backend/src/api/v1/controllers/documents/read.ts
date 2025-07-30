import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  /* -------------------------- *
   * - get one document by id - *
   * -------------------------- */
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    try {
      const document = await db.client.client.document.findUnique({
        where: { id, isDeleted: false },
        include: db.client.include.document,
      });
      if (document) {
        return utils.handlers.success(req, res, {
          message: "query successful",
          data: await db.client.filterModels([document]),
          count: 1,
        });
      }
      return utils.handlers.error(req, res, "general", {
        errno: 13,
      });
    } catch (err: any) {
      console.log("error occured");
      return utils.handlers.error(req, res, "general", {
        data: [{ details: JSON.stringify(err) }],
      });
    }
  }
  const { ids } = req.body;
  try {
    if (ids) {
      /* ------------------------------------ *
       * get some documents by ids ---------- *
       * ------------------------------------ */
      const documents = await db.client.client.document.findMany({
        where: { isDeleted: false, id: { in: ids } },
        include: db.client.include.document,
      });
      filtered = await db.client.filterModels(documents);
      count = documents.length;
      const idsCount = ids.length;
      return utils.handlers.success(req, res, {
        message:
          count === idsCount
            ? "query success"
            : !idsCount
              ? "no data found"
              : `${count}/${idsCount} found`,
        data: filtered,
        count,
      });
    } else {
      /* ----------------------------------- *
       * get all documents ----------------- *
       * requires login and admin privileges *
       * ----------------------------------- */
      const { isLoggedIn } = req.body.auth;
      if (!isLoggedIn) {
        return utils.handlers.error(req, res, "authentication", {});
      }
      const { profile: user } = req.body?.auth?.profile;
      if (!user || !user.isAdmin) {
        return utils.handlers.error(req, res, "authentication", { errno: 31 });
      }
      const documents = await db.client.client.document.findMany({
        where: { isDeleted: false },
        include: db.client.include.document,
      });
      filtered = await db.client.filterModels(documents);
      count = documents.length;
      return utils.handlers.success(req, res, {
        message: count ? "query success" : "no data found",
        data: filtered,
        count,
      });
    }
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default read;
