import { Request, Response, NextFunction } from "express";

const easeStrictValidation = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  console.log("EASING STRICT VALIDATION");
  req.body.auth.strictMode = false;
  next();
};

export default easeStrictValidation;
