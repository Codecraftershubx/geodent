import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one country by id
  const { id } = req.params;
  if (id) {
    const country = await db.client.client.country.findMany({ where: { id } });
    if (country.length) {
      return utils.handlers.success(res, {
        message: "query successful",
        data: country,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `country ${id} not found`,
      status: 404,
    });
  }
  // get all countries
  const countries = await db.client.client.country.findMany();
  if (countries.length) {
    return utils.handlers.success(res, {
      message: "query success",
      data: countries,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no country created yet",
    status: 404,
  });
};

export default read;
