import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.states.get);
router.get("/:id", controllers.states.get);
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
      "data.numericCode",
      "data.countryId",
    ])
      .notEmpty()
      .withMessage("required field"),
    body("data.countryId").isUUID().withMessage("expects uuid"),
    body("data.aka").optional().notEmpty().withMessage("value cannot be empty"),
  ],
  controllers.states.create,
);
router.put(
  "/:id",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object")
      .custom((value: Record<string, any>) => {
        if (!Object.keys(value).length) {
          throw new Error("value cannot be empty");
        }
        for (let [key, val] of Object.entries(value)) {
          if (typeof val === "string" && !val.length) {
            throw new Error(`${key} is empty string`);
          }
          if (typeof val === "undefined") {
            throw new Error(`${key} is empty`);
          }
          if (val === null) {
            throw new Error(`${key} cannot be null`);
          }
          if (
            (key === "alpha2Code" ||
              key === "alpha3Code" ||
              key === "countryId" ||
              key === "name") &&
            typeof val !== "string"
          ) {
            throw new Error(`${key} must be a string`);
          }
        }
        return true;
      }),
  ],
  controllers.states.update,
);

router.delete("/:id", controllers.states.delete);
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
        const { schools, documents, listings, tags } = value || {};
        if (!schools && !documents && !listings && !tags) {
          throw new Error("schools, documents, listings and tags missing");
        }
        return true;
      }),
  ],
  controllers.states.connections,
);
router.put("/:id/restore", controllers.states.restore);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This state resource doesn't exist" });
  return;
});

export default router;
