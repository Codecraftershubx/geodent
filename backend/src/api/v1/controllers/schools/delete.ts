import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteSchool = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify school exists
  const school = await db.client.client.school.findMany({
    where: { id, isDeleted: false },
  });
  if (!school.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `school not found`,
    });
  }
  // delete school
  await db.client.client.school.update({
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
};

export default deleteSchool;
