import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one city by id
  const { id } = req.params;
  let count;
  if (id) {
    const city = await db.client.client.city.findMany({
      where: { id },
      include: {
        schools: true,
        documents: true,
        listings: true,
      },
    });
    count = city.length;
    if (count) {
      return utils.handlers.success(res, {
        message: "query successful",
        data: city,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `city ${id} not found`,
      status: 404,
    });
  }
  // get all cities
  const cities = await db.client.client.city.findMany({
    include: {
      schools: true,
      documents: true,
      listings: true,
    },
  });
  count = cities.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: cities,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no cities created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
