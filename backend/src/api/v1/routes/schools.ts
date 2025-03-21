import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
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

router.put(
  "/:id",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
  ],
  controllers.schools.update,
);

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
        const { campuses, documents, listings, tags } = value || {};
        if (!campuses && !documents && !listings && !tags) {
          throw new Error("campuses, documents, listings and tags missing");
        }
        return true;
      })
      .withMessage("one of campuses, documents, listings or tags required"),
  ],
  controllers.schools.connections,
);
router.put("/:id/restore", controllers.schools.restore);
router.delete("/:id", controllers.schools.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This School resource doesn't exist" });
  return;
});

export default router;
