import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  /* ---------------------------------------- */
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
  try {
    /* ------------------------------------------ */
    /* - Validate Country Exists and is Deleted - */
    /* ------------------------------------------ */
    const country = await db.client.client.country.findMany({
      where: { id, isDeleted: true },
    });
    if (!country.length) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    // restore country
    await db.client.client.country.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    return utils.handlers.success(req, res, {
      message: "country restored",
      errno: 44,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default restore;
