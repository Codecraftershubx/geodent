import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restoreFlat = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  const { id } = req.params;
  try {
    /* --------------------------------------- */
    /* - Validate Flat Exists and is Deleted - */
    /* --------------------------------------- */
    const flat = await db.client.client.flat.findUnique({
      where: { id, isDeleted: true },
    });
    if (!flat) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* --------------- */
    /* - Restore Flat  */
    /* --------------- */
    await db.client.client.flat.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    return utils.handlers.success(req, res, {
      message: "restored",
      errno: 44,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default restoreFlat;
