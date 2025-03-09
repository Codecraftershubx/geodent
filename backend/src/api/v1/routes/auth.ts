import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.post(
  "/signup",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body(["data.firstName", "data.lastName", "data.password", "data.email"])
      .notEmpty()
      .withMessage("required field"),
    body("data.phone")
      .optional()
      .notEmpty()
      .withMessage("value cannot be empty")
      .isString()
      .withMessage("phone must be a string"),
  ],
  controllers.auth.signup,
);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This amenities resource doesn't exist" });
  return;
});

export default router;
