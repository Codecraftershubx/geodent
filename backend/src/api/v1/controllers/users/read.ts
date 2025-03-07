import { Response, Request } from "express";

const read = (_: Request, res: Response) => {
  res.json({ controller: "readuser", message: "success" });
};

export default read;
