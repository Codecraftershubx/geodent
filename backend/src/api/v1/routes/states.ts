import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.states.get);
router.get("/:id", controllers.states.get);
router.post(
  "/create",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body([
      "data.name",
      "data.alpha2Code",
      "data.alpha3Code",
      "data.numericCode",
      "data.countryId",
    ])
      .notEmpty()
      .withMessage("required field"),
    body("data.aka").optional().notEmpty().withMessage("value cannot be empty"),
  ],
  controllers.states.create,
);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This state resource doesn't exist" });
  return;
});

export default router;
