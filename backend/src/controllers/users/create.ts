import { Request, Response } from "express";

const createNewUser = (_: Request, res: Response) => {
  res.status(201).json({ controller: "createNewUser", message: "success" });
  return;
};

export default createNewUser;
