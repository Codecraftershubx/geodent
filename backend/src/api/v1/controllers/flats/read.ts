import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  try {
    /* -------------------------- *
     * - get one document by id - *
     * -------------------------- */
    const { id } = req.params;
    let count;
    let filtered;
    if (id) {
      const flat = await db.client.client.flat.findUnique({
        where: { id, isDeleted: false },
        include: db.client.include.room,
      });
      if (flat) {
        return utils.handlers.success(req, res, {
          message: "query successful",
          data: await db.client.filterModels([flat]),
          count: 1,
        });
      }
      return utils.handlers.error(req, res, "general", {
        errno: 13,
      });
    }
    const { ids } = req.body;
    if (ids) {
      /* ----------------------- *
       * get some flats by ids - *
       * ----------------------- */
      const flats = await db.client.client.document.findMany({
        where: { isDeleted: false, id: { in: ids } },
        include: db.client.include.document,
      });
      filtered = await db.client.filterModels(flats);
      count = flats.length;
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
      /* --------------- *
       * get all flats - *
       * --------------- */
      const flats = await db.client.client.flat.findMany({
        where: { isDeleted: false },
        include: db.client.include.room,
      });
      filtered = await db.client.filterModels(flats);
      count = flats.length;
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
