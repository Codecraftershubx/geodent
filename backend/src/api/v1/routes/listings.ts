import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.rooms.get);
router.get("/:id", controllers.rooms.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body(["data.shortDescr", "data.name", "data.type", "data.proximity"])
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
    body("data.type")
      .isIn(["STUDIO", "SELF_CONTAINED", "FLAT", "BLOCK"])
      .withMessage("unknown listing type"),
    body("data.proximity")
      .isIn(["IN", "NEAR"])
      .withMessage("unknown proximity"),
    body(["data.longDescr"])
      .optional()
      .notEmpty()
      .withMessage("expects a value")
      .isString()
      .withMessage("expects a string"),
    body("data.price")
      .notEmpty()
      .withMessage("required field")
      .isDecimal()
      .withMessage("expects decimal"),
    body("data.isAvailable")
      .default(false)
      .notEmpty()
      .withMessage("expects a value")
      .toBoolean()
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body([
      "data.cityId",
      "data.countryId",
      "data.stateId",
      "data.userId",
      "data.schoolId",
    ])
      .notEmpty()
      .withMessage("required field")
      .isUUID()
      .withMessage("expects uuid"),
    body("data.campusId").optional().isUUID().withMessage("expects uuid"),
    body(["data.tags", "data.documents"])
      .notEmpty()
      .withMessage("required")
      .isArray({ min: 1 })
      .withMessage("expects an array >=1 "),
    body(["data.tags.*", "data.documents.*"])
      .isUUID()
      .withMessage("expects a uuid"),
    body("data").custom((value) => {
      const { rooms, flats, blocks } = value || {};
      if (!rooms && !flats && !blocks) {
        throw new Error("one of blocks, flats or rooms required");
      }
      return true;
    }),
    body([
      "data.rooms",
      "data.likes",
      "data.reviews",
      "data.flats",
      "data.blocks",
    ])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isArray({ min: 1 })
      .withMessage("expects an array >= 1"),
    body([
      "data.rooms.*",
      "data.likes.*",
      "data.reviews.*",
      "data.flats.*",
      "data.blocks.*",
    ])
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
  ],
  controllers.listings.create,
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
  controllers.rooms.update,
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
        const { documents, tags } = value || {};
        if (!documents && !tags) {
          throw new Error("documents and tags data missing");
        }
        return true;
      }),
    body(["data.documents", "data.tags"])
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects an array >=1 "),
    body(["data.documents.*", "data.tags.*"])
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
  ],
  controllers.rooms.connections,
);
router.put("/:id/restore", controllers.rooms.restore);
router.delete("/:id", controllers.rooms.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This amenity resource doesn't exist" });
  return;
});

export default router;
