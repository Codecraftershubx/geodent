import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one country by id
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    const country = await db.client.client.country.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.country,
    });
    count = country.length;
    if (count) {
      filtered = await db.client.filterModels(country);
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(req, res, "general", {
      message: `country not found`,
      status: 404,
    });
  }
  // get all countries
  const countries = await db.client.client.country.findMany({
    where: { isDeleted: false },
    include: db.client.include.country,
  });
  count = countries.length;
  if (count) {
    filtered = await db.client.filterModels(countries);
    return utils.handlers.success(req, res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(req, res, "general", {
    message: "no country created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
