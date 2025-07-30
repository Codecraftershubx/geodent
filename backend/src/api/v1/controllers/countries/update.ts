import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const update = async (req: Request, res: Response): Promise<void> => {
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
  /* ---------------------- */
  /* - Validate sent data - */
  /* ---------------------- */
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { id } = req.params;
  const data = matchedData(req);
  try {
    /* ---------------- ---------- */
    /* - Validate Country Exists - */
    /* --------------------------- */
    const country = await db.client.client.country.findUnique({
      where: { id, isDeleted: false },
    });
    if (!country) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* ------------------ */
    /* - Update Country - */
    /* ------------------ */
    let updatedUser = await db.client.client.country.update({
      where: { id },
      data,
    });
    const filtered = await db.client.filterModels([updatedUser]);
    return utils.handlers.success(req, res, {
      message: "update successful",
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
