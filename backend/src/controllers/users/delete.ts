import { Response, Request } from "express";

const deleteUser = (_: Request, res: Response) => {
  res.json({ controller: "User delete", message: "success" });
};

export default deleteUser;
