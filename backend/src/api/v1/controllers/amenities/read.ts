import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  /* -------------------------- *
   * - get one amenity by id - *
   * ------------------------- */
  const { id } = req.params;
  let count;
  let filtered;
  const include = {
    blocks: { omit: db.client.omit.default },
    flats: { omit: db.client.omit.default },
    listings: { omit: db.client.omit.default },
    rooms: { omit: db.client.omit.default },
  };
  try {
    if (id) {
      const amenity = await db.client.client.amenity.findUnique({
        where: { id, isDeleted: false },
        include,
      });
      if (amenity) {
        return utils.handlers.success(req, res, {
          message: "query success",
          data: await db.client.filterModels([amenity]),
          count: 1,
        });
      }
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* --------------------- *
     * - get all amenities - *
     * --------------------- */
    const amenities = await db.client.client.amenity.findMany({
      where: { isDeleted: false },
      include,
    });
    filtered = await db.client.filterModels(amenities);
    count = amenities.length;
    return utils.handlers.success(req, res, {
      message: count ? "query success" : "no data found",
      data: filtered,
      count,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default read;
