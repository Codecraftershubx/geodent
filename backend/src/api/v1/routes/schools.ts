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
    body(["data.name", "data.type", "data.zip", "data.street"])
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects string"),
    body("data.type")
      .isIn(["COLLEGE", "POLYTECHNIC", "UNIVERSITY"])
      .withMessage("unknown type"),
    body("data.description")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty"),
    body("data.tags")
      .notEmpty()
      .withMessage("required")
      .isArray({ min: 1 })
      .withMessage("expects array >=1 "),
    body("data.tags.*")
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects uuid"),
    body(["data.cityId", "data.countryId", "data.stateId"])
      .notEmpty()
      .withMessage("required field")
      .isUUID()
      .withMessage("expects uuid"),
    body(["data.longitude", "latitude"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isFloat()
      .withMessage("expects a float"),
    body(["data.number", "data.poBox"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isInt({ min: 1 })
      .withMessage("expects integer >=1 "),
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
      }),
    body(["data.campuses", "data.documents", "data.listings", "data.tags"])
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects an array >= 1"),
    body([
      "data.campuses.*",
      "data.documents.*",
      "data.listings.*",
      "data.tags.*",
    ])
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects uuid"),
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
