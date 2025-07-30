import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restoreBlock = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  try {
    /* ---------------------------------------- */
    /* - Validate Block Exists and is Deleted - */
    /* ---------------------------------------- */
    const { id } = req.params;
    const block = await db.client.client.block.findUnique({
      where: { id, isDeleted: true },
    });
    if (!block) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* ------------- TODO ---------------- *
     * - Validate User Owns the Block ---- *
     * ----------------------------------- */

    /* ----------------- */
    /* - Restore Block - */
    /* ----------------- */
    await db.client.client.block.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    return utils.handlers.success(req, res, {
      message: "block restored",
      count: 1,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default restoreBlock;
