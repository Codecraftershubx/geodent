import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one country by id
  const { id } = req.params;
  let count;
  let filtered;
  const include = {
    blocks: { omit: db.client.omit.default },
    flats: { omit: db.client.omit.default },
    listings: { omit: db.client.omit.default },
    rooms: { omit: db.client.omit.default },
  };
  if (id) {
    const amenity = await db.client.client.amenity.findMany({
      where: { id, isDeleted: false },
      include,
    });
    count = amenity.length;
    if (count) {
      filtered = await db.client.filterModels(amenity);
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(req, res, "general", {
      message: `amenity not found`,
      status: 404,
    });
  }
  // get all countries
  const amenities = await db.client.client.amenity.findMany({
    where: { isDeleted: false },
    include,
  });
  filtered = await db.client.filterModels(amenities);
  count = amenities.length;
  if (count) {
    return utils.handlers.success(req, res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(req, res, "general", {
    message: "no amenity created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
