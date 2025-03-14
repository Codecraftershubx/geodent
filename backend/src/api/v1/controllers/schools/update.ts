import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const update = async (req: Request, res: Response): Promise<void> => {
  // get one city by id
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { id } = req.params;
  const { data } = matchedData(req);

  // verify school exists
  const school = await db.client.client.school.findMany({
    where: { id, isDeleted: false },
  });
  if (!school.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `school ${id} not found`,
    });
  }
  // update school
  let updatedSchool = await db.client.client.school.update({
    where: { id },
    data,
  });
  const filtered = await db.client.filterModels([updatedSchool]);
  return utils.handlers.success(res, {
    message: "update successful",
    count: 1,
    data: filtered,
  });
};

export default update;
