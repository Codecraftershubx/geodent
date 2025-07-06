import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one state by id
  const { id } = req.params;
  let count;
  let filtered;
  if (id) {
    const state = await db.client.client.state.findMany({
      where: { id, isDeleted: false },
      include: db.client.include.state,
    });
    count = state.length;
    if (count) {
      filtered = await db.client.filterModels(state);
      return utils.handlers.success(req, res, {
        message: "query successful",
        data: filtered,
        count,
      });
    }
    return utils.handlers.error(req, res, "general", {
      message: `state ${id} not found`,
      status: 404,
    });
  }
  // get all states
  const states = await db.client.client.state.findMany({
    where: { isDeleted: false },
    include: db.client.include.state,
  });
  count = states.length;
  if (count) {
    filtered = await db.client.filterModels(states);
    return utils.handlers.success(req, res, {
      message: "query success",
      data: filtered,
      count,
    });
  }
  return utils.handlers.error(req, res, "general", {
    message: "no states created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
