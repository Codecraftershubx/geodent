import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    // get room by id if exists
    const listing = await db.client.client.listing.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.listing,
    });
    count = listing.length;
    if (count) {
      filtered = await db.client.filterModels(listing);
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(req, res, "general", {
      message: `listing not found`,
      status: 404,
    });
  }
  // get all listings
  const listings = await db.client.client.listing.findMany({
    where: { isDeleted: false },
    include: db.client.include.listing,
  });
  filtered = await db.client.filterModels(listings);
  count = listings.length;
  if (count) {
    return utils.handlers.success(req, res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(req, res, "general", {
    message: "no listing created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
