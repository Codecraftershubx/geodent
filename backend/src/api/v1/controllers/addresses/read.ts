import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one country by id
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    const address = await db.client.client.address.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.address,
    });
    count = address.length;
    if (count) {
      filtered = await db.client.filterModels(address);
      return utils.handlers.success(res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `address not found`,
      status: 404,
    });
  }
  // get all countries
  const addresses = await db.client.client.address.findMany({
    where: { isDeleted: false },
    include: db.client.include.address,
  });
  filtered = await db.client.filterModels(addresses);
  count = addresses.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no address created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
