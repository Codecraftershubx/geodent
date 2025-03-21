import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restoreSchool = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify flag exists
  const school = await db.client.client.school.findMany({
    where: { id, isDeleted: true },
  });
  if (!school.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `school not found`,
    });
  }
  // restore school
  await db.client.client.school.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(res, {
    message: "school restored successfully",
    count: 1,
  });
};

export default restoreSchool;
