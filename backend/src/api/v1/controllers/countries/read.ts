import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  //* ---------------------------------------- */
  /* - Validate User Logged In and is Admin - */
  /* ---------------------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  const { profile: user } = req.body?.auth?.profile;
  if (!user || !user.isAdmin) {
    return utils.handlers.error(req, res, "authentication", { errno: 31 });
  }
  const { id } = req.params;
  let count;
  let filtered;
  try {
    if (id) {
      /* ------------------------- *
       * - get one country by id - *
       * ------------------------- */
      const country = await db.client.client.country.findUnique({
        where: { id, isDeleted: false },
        include: db.client.include.country,
      });
      if (country) {
        return utils.handlers.success(req, res, {
          message: "query successful",
          data: await db.client.filterModels([country]),
          count: 1,
        });
      }
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* --------------------- *
     * - get all countries - *
     * --------------------- */
    const countries = await db.client.client.country.findMany({
      where: { isDeleted: false },
      include: db.client.include.country,
    });
    count = countries.length;
    return utils.handlers.success(req, res, {
      message: count ? "query success" : "no match found",
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
