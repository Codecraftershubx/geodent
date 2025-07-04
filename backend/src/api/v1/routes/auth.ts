import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.post(/^\/(signin|login)\/?$/, controllers.auth.login);
router.post(/^\/(signout|logout)\/?$/, controllers.auth.logout);
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
