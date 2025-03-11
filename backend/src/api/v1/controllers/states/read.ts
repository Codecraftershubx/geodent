import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  // get one state by id
  const { id } = req.params;
  let count;
  if (id) {
    const state = await db.client.client.state.findMany({
      where: { id },
      include: {
        schools: true,
        documents: true,
        listings: true,
        cities: true,
      },
    });
    count = state.length;
    if (count) {
      return utils.handlers.success(res, {
        message: "query successful",
        data: state,
        count,
      });
    }
    return utils.handlers.error(res, "general", {
      message: `state ${id} not found`,
      status: 404,
    });
  }
  // get all states
  const states = await db.client.client.state.findMany({
    include: {
      schools: true,
      documents: true,
      listings: true,
      cities: true,
    },
  });
  count = states.length;
  if (count) {
    return utils.handlers.success(res, {
      message: "query success",
      data: states,
      count,
    });
  }
  return utils.handlers.error(res, "general", {
    message: "no states created yet",
    status: 404,
    count: 0,
    data: [],
  });
};

export default read;
