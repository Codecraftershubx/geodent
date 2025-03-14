import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one city by id
  const { id } = req.params;
  let count;
  const include = {
    address: { omit: db.client.omit.default },
    documents: { omit: db.client.omit.default },
    listings: { omit: db.client.omit.default },
    chatrooms: { omit: db.client.omit.default },
    likes: { omit: db.client.omit.like },
    likedBy: { omit: db.client.omit.like },
    notifications: { omit: db.client.omit.like },
    tenancy: { omit: db.client.omit.default },
    rentals: { omit: db.client.omit.like },
    reviews: { omit: db.client.omit.default },
    receivedReviews: { omit: db.client.omit.default },
    messages: { omit: db.client.omit.default },
    rooms: { omit: db.client.omit.default },
    flats: { omit: db.client.omit.default },
    verifications: { omit: db.client.omit.default },
  };
  if (id) {
    const user = await db.client.client.user.findMany({
      where: { id, isDeleted: false },
      include,
      omit: db.client.omit.user,
    });
    count = user.length;
    if (count) {
      return utils.handlers.success(res, {
        message: "query successful",
        data: [user],
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `user not found`,
      status: 404,
    });
  }
  // get all cities
  const users = await db.client.client.user.findMany({
    where: { isDeleted: false },
    include,
    omit: db.client.omit.user,
  });

  count = users.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: users,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no users created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
