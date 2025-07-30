import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteBlock = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }

  try {
    /* -------------------------- */
    /* - Validate Block Exists - */
    /* ------------------------- */
    const { id } = req.params;
    const block = await db.client.client.block.findUnique({
      where: { id, isDeleted: false },
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
    /* - Delete Block - */
    /* ---------------- */
    await db.client.client.block.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      },
    });
    return utils.handlers.success(req, res, {
      message: "delete successful",
      count: 1,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default deleteBlock;
