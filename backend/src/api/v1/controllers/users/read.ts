import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one user by id
  const { id } = req.params;
  let count;
  const include = {
    address: { omit: db.client.omit.default },
    documents: { omit: db.client.omit.default },
    chatrooms: { omit: db.client.omit.default },
    likes: { omit: db.client.omit.like },
    listings: { omit: db.client.omit.default },
    notifications: { omit: db.client.omit.like },
    tenancy: { omit: db.client.omit.default },
    rentals: { omit: db.client.omit.default },
    reviews: { omit: db.client.omit.default },
    receivedReviews: { omit: db.client.omit.default },
    messages: { omit: db.client.omit.default },
    rooms: { omit: db.client.omit.default },
    flats: { omit: db.client.omit.default },
    verifications: { omit: db.client.omit.default },
  };

  // if param is sent
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
        data: user,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `user not found`,
      include,
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
      message: "query successful",
      data: users,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no user created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
