import { Request, Response } from "express";
import type { TPayload, TUserModel } from "../../../../utils/types.js";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const read = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (id) {
    console.log("getting country:", id);
  } else {
    console.log("getting all countries");
  }
  res.send();
  return;
};

export default read;
