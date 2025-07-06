import { Request, Response } from "express";
import { validationResult } from "express-validator";
import utils from "../../../../utils/index.js";
import services from "../services/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
  // validate sent data
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }
  const array = req?.files || null;
  if (!array || !Array.isArray(array) || !array.length) {
    return utils.handlers.error(req, res, "validation", {
      message: "no file uploaded",
    });
  }
  const files = array as Express.Multer.File[];
  const data = req.body;
  const result = await services.documents.create({ files, data });
  if (result.error) {
    const errData: Record<string, any> = { message: result.details.message };
    if (result.details.status) {
      errData.status = result.details.status;
    }
    if (result.details.data) {
      errData.data = result.details.data;
    }
    return utils.handlers.error(req, res, `${result.details.type}`, {
      ...errData,
    });
  }
  return utils.handlers.success(req, res, { ...result.data });
};

export default create;
