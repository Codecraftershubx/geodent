import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }

  // verify address exists
  const { id } = req.params;
  const address = await db.client.client.address.findMany({
    where: { id, isDeleted: true },
  });
  if (!address.length) {
    return utils.handlers.error(req, res, "validation", {
      errno: 13,
      message: `address not found`,
    });
  }
  // restore address
  await db.client.client.address.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(req, res, {
    message: "address restored successfully",
    count: 1,
  });
};

export default restore;
