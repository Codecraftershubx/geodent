import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one country by id
  const { id } = req.params;
  let count;
  let filtered;
  const include = {
    address: { omit: db.client.omit.default },
    listing: { omit: db.client.omit.default },
    block: { omit: db.client.omit.default },
    landlord: { omit: db.client.omit.user },
    rooms: { omit: db.client.omit.default },
    amenities: { omit: db.client.omit.default },
    tags: { omit: db.client.omit.default },
    documents: { omit: db.client.omit.default },
  };
  if (id) {
    // get one flat by id
    const flat = await db.client.client.flat.findMany({
      where: { id, isDeleted: false },
      include,
    });
    count = flat.length;
    if (count) {
      filtered = await db.client.filterModels(flat);
      return utils.handlers.success(res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `flat not found`,
      status: 404,
    });
  }
  // get all flats
  const flats = await db.client.client.flat.findMany({
    where: { isDeleted: false },
    include,
  });
  filtered = await db.client.filterModels(flats);
  count = flats.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no flat created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
