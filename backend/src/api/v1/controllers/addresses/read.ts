import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let count;
  let filtered;
  try {
    /* ------------------------- *
     * get one addresses by id - *
     * ------------------------ */
    if (id) {
      const address = await db.client.client.address.findUnique({
        where: { id, isDeleted: false },
        include: db.client.include.address,
      });
      if (address) {
        return utils.handlers.success(req, res, {
          message: "query success",
          data: await db.client.filterModels([address]),
          count: 1,
        });
      }
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }

    /* ------------------------------------ *
     * get all addresses ------------------ *
     * first validate user is admin: only - *
     * admin can fetch all addresses ------ *
     * ------------------------------------ */
    const { profile: user } = req.body?.auth?.profile;
    if (!user || !user.isAdmin) {
      return utils.handlers.error(req, res, "authentication", {});
    }
    const addresses = await db.client.client.address.findMany({
      where: { isDeleted: false },
      include: db.client.include.address,
    });
    filtered = await db.client.filterModels(addresses);
    count = addresses.length;
    return utils.handlers.success(req, res, {
      message: count ? "query success" : "no data found",
      data: filtered,
      count,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default read;
