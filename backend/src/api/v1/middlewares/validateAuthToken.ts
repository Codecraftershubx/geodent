import { Request, Response, NextFunction } from "express";
import utils from "../../../utils/index.js";

const validateAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("VALIDATING AUTH TOKEN");
  // validate headers sent
  const authHeader = req.headers.authorization;
  if (authHeader) {
    console.log("\tAUTH HEADER PROVIDED");
    // validate header in right format and in header
    const [title, aT] = authHeader.split(" ");
    if (!aT || title !== "Bearer") {
      return utils.handlers.error(req, res, "authentication", {
        message: "Unauthorised! Bad headers",
        status: 403,
      });
    }
    try {
      // validate token's not expired
      let { payload: aTData } = utils.tokens.decompose.accessToken(aT);
      if (aTData === null) {
        return utils.handlers.error(req, res, "authentication", {
          message: "Unauthorised: session expired",
        });
      }
      req.body.auth.payload = aTData;
      next();
    } catch (err: any) {
      return utils.handlers.error(req, res, "general", {
        message: "Some error occured",
        status: 500,
        data: [{ details: err }],
      });
    }
  } else {
    if (req.body.auth.strictMode) {
      console.log("\tFAILED: NO CREDENTIALS PROVIDED");
      return utils.handlers.error(req, res, "authentication", {
        message: "Unauthorised!",
        status: 403,
      });
    }
    console.log("\tPROCEEDING TO NEXT MIDDLEWARE");
    next();
  }
};

export default validateAuthToken;
