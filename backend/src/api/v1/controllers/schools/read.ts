import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let count;
  let filtered;

  // get one school by id
  if (id) {
    const school = await db.client.client.school.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.school,
    });
    count = school.length;
    if (count) {
      filtered = await db.client.filterModels(school);
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(req, res, "general", {
      message: `school not found`,
      status: 404,
    });
  }
  // get all schools
  const schools = await db.client.client.school.findMany({
    where: { isDeleted: false },
    include: db.client.include.school,
  });

  count = schools.length;
  if (count) {
    filtered = await db.client.filterModels(schools);
    return utils.handlers.success(req, res, {
      message: "query successful",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(req, res, "general", {
    message: "no schools created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
