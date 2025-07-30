import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restoreCity = async (req: Request, res: Response): Promise<void> => {
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

  /* --------------------------------------- */
  /* - Validate City Exists and is Deleted - */
  /* --------------------------------------- */
  const city = await db.client.client.city.findUnique({
    where: { id, isDeleted: true },
  });
  if (!city) {
    return utils.handlers.error(req, res, "validation", {
      errno: 13,
    });
  }
  /* ---------------- */
  /* - Restore City - */
  /* ---------------- */
  await db.client.client.city.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(req, res, {
    message: "city restored",
    errno: 44,
  });
};

export default restoreCity;
