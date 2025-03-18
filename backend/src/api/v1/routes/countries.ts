import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.countries.get);
router.get("/:id", controllers.countries.get);
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
      "data.alpha2Code",
      "data.alpha3Code",
      "data.currency",
      "data.currencyCode",
      "data.numericCode",
    ])
      .notEmpty()
      .withMessage("required field"),
    body("data.aka").optional().notEmpty().withMessage("value cannot be empty"),
  ],
  controllers.countries.create,
);

router.put(
  "/:id",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
  ],
  controllers.countries.update,
);

router.delete("/:id", controllers.countries.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This country resource doesn't exist" });
  return;
});

export default router;
