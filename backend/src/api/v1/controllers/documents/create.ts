import { Request, Response } from "express";
import { validationResult } from "express-validator";
import utils from "../../../../utils/index.js";
import services from "../services/index.js";
import type { TCreateOpRes } from "../services/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
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

  /* --------------------- */
  /* - Proceed to Create - */
  /* --------------------- */
  const array = req?.files || null;
  if (!array || !Array.isArray(array) || !array.length) {
    return utils.handlers.error(req, res, "validation", { errno: 12 });
  }
  const files = array as Express.Multer.File[];
  const data = req.body;
  const result: TCreateOpRes = await services.documents.create({
    files,
    data,
  });
  const resDetails: Record<string, any> = { ...result.details };
  delete resDetails.type;
  if (result.error) {
    return utils.handlers.error(req, res, resDetails.type, {
      ...result.details,
    });
  }
  return utils.handlers.success(req, res, { ...result.details });
};

export default create;
