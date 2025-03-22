import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
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
router.put(
  "/:id/connections",
  [
    query("extend")
      .default(true)
      .notEmpty()
      .toBoolean()
      .withMessage("cannot be empty")
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body(["data"])
      .notEmpty()
      .withMessage("required")
      .isObject()
      .withMessage("expects an object")
      .custom((value) => {
        const { listings, documents, schools, tags } = value || {};
        if (!listings && !documents && !schools && !tags) {
          throw new Error("listings, documents, schools and tags missing");
        }
        return true;
      }),
  ],
  controllers.countries.connections,
);

router.put("/:id/restore", controllers.countries.restore);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This country resource doesn't exist" });
  return;
});

export default router;
