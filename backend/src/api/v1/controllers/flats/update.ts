import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const update = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  /* ----------------------- */
  /* - Validate sent data - */
  /* ---------------------- */
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      errno: 11,
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { id } = req.params;
  const data = matchedData(req);

  try {
    /* ------------------------ */
    /* - Validate Flat Exists - */
    /* ------------------------ */
    const flat = await db.client.client.flat.findUnique({
      where: { id, isDeleted: false },
    });
    if (!flat) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* -------------- */
    /* - Update Flat  */
    /* -------------- */
    let updated = await db.client.client.flat.update({
      where: { id },
      data,
    });
    const filtered = await db.client.filterModels([updated]);
    return utils.handlers.success(req, res, {
      message: "updated",
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default update;
