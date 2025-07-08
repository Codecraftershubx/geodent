import express, { Response, Request, Router, NextFunction } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router: Router = express.Router();

router.post(
  /^\/(signin|login)\/?$/,
  middlewares.easeStrictValidation,
  middlewares.validateAuthToken,
  middlewares.validateTokenPayload,
  middlewares.validateAuthCredentials,
  controllers.auth.login
);
router.post(
  /^\/(signout|logout)\/?$/,
  middlewares.validateAuthToken,
  middlewares.validateTokenPayload,
  middlewares.validateIsLoggedIn,
  controllers.auth.logout
);
router.post("/refresh", controllers.auth.refreshAccessToken);
router.post(
  "/signup",
  [
    body(["firstName", "lastName", "password", "email"])
      .notEmpty()
      .withMessage("required field"),
    body("phone")
      .optional()
      .notEmpty()
      .withMessage("value cannot be empty")
      .isString()
      .withMessage("phone must be a string"),
  ],
  controllers.auth.signup
);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This auth resource doesn't exist" });
  return;
});

export default router;
