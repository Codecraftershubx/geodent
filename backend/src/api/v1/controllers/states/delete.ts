import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteState = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // verify state exists
  const state = await db.client.client.state.findMany({
    where: { id, isDeleted: false },
  });
  if (!state.length) {
    return utils.handlers.error(req, res, "validation", {
      status: 404,
      message: `state not found`,
    });
  }
  // delete state
  await db.client.client.state.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    },
  });
  return utils.handlers.success(req, res, {
    message: "delete successful",
    count: 1,
  });
};

export default deleteState;
