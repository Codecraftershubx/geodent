import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one city by id
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    const city = await db.client.client.city.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.city,
    });
    count = city.length;
    if (count) {
      filtered = await db.client.filterModels(city);
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(req, res, "general", {
      message: `city ${id} not found`,
      status: 404,
    });
  }
  // get all cities
  const cities = await db.client.client.city.findMany({
    where: { isDeleted: false },
    include: db.client.include.city,
  });
  count = cities.length;
  if (count) {
    filtered = await db.client.filterModels(cities);
    return utils.handlers.success(req, res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(req, res, "general", {
    message: "no cities created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
