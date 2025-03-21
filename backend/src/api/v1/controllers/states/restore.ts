import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const restore = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify state exists
  const state = await db.client.client.state.findMany({
    where: { id, isDeleted: true },
  });
  if (!state.length) {
    return utils.handlers.error(res, "validation", {
      status: 404,
      message: `state not found`,
    });
  }
  // restore state
  await db.client.client.state.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
  return utils.handlers.success(res, {
    message: "state restored successfully",
    count: 1,
  });
};

export default restore;
