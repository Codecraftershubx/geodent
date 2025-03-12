import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const filter = ["isDeleted", "deleteAt", "serial"];

const read = async (req: Request, res: Response): Promise<void> => {
  // get one city by id
  const { id } = req.params;
  let count;
  if (id) {
    const dbCity = await db.client.client.school.findMany({
      where: { id, isDeleted: false },
      include: {
        address: true,
        documents: true,
        listings: true,
        campuses: true,
        state: true,
        country: true,
        city: true,
      },
    });
    const city = db.client.filterModels(dbCity, filter);
    count = city.length;
    if (count) {
      return utils.handlers.success(res, {
        message: "query successful",
        data: city,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `school ${id} not found`,
      status: 404,
    });
  }
  // get all cities
  const dbCities = await db.client.client.school.findMany({
    include: {
      address: true,
      documents: true,
      listings: true,
      campuses: true,
      state: true,
      country: true,
      city: true,
    },
  });
  const cities = db.client.filterModels(dbCities, filter);
  count = cities.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: cities,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no schools created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
