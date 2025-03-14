import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one city by id
  const { id } = req.params;
  let count;
  if (id) {
    const school = await db.client.client.school.findMany({
      where: { id, isDeleted: false },
      include: {
        address: { omit: db.client.omit.address },
        campuses: { omit: db.client.omit.campus },
        documents: { omit: db.client.omit.document },
        listings: { omit: db.client.omit.listing },
        state: { omit: db.client.omit.state },
        country: { omit: db.client.omit.country },
      },
      omit: db.client.omit.school,
    });
    count = school.length;
    if (count) {
      return utils.handlers.success(res, {
        message: "query successful",
        data: school,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `school ${id} not found`,
      status: 404,
    });
  }
  // get all cities
  const schools = await db.client.client.school.findMany({
    where: { isDeleted: false },
    include: {
      address: { omit: db.client.omit.address },
      campuses: { omit: db.client.omit.campus },
      documents: { omit: db.client.omit.document },
      listings: { omit: db.client.omit.listing },
      state: { omit: db.client.omit.state },
      country: { omit: db.client.omit.country },
    },
    omit: db.client.omit.school,
  });

  count = schools.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: schools,
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
