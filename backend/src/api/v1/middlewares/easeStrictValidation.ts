import { Request, Response, NextFunction } from "express";

const easeStrictValidation = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  req.body.auth.strictMode = false;
  next();
};

export default easeStrictValidation;
