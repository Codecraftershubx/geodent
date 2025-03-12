import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.schools.get);
router.get("/:id", controllers.schools.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body([
      "data.name",
      "data.type",
      "data.zip",
      "data.street",
      "data.type",
      "data.stateId",
      "data.cityId",
      "data.countryId",
    ])
      .notEmpty()
      .withMessage("required field"),
    body([
      "data.description",
      "data.number",
      "data.poBox",
      "data.latitude",
      "data.longitude",
    ])
      .optional()
      .notEmpty()
      .withMessage("value cannot be empty"),
  ],
  controllers.schools.create,
);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This city resource doesn't exist" });
  return;
});

export default router;
