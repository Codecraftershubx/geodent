import { Response, Request } from "express";

const update = (_: Request, res: Response) => {
  res.json({ controller: "user Update", message: "success" });
};

export default update;
