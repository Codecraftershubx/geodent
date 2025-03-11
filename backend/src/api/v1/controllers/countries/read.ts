import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one country by id
  const { id } = req.params;
  let count;
  if (id) {
    const country = await db.client.client.country.findMany({
      where: { id },
      include: {
        states: true,
        documents: true,
        listings: true,
        schools: true,
      },
    });
    count = country.length;
    if (count) {
      return utils.handlers.success(res, {
        message: "query successful",
        data: country,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `country ${id} not found`,
      status: 404,
    });
  }
  // get all countries
  const countries = await db.client.client.country.findMany({
    include: {
      states: true,
      documents: true,
      listings: true,
      schools: true,
    },
  });
  count = countries.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: countries,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no country created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
