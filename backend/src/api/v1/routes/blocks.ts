import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.blocks.get);
router.get("/:id", controllers.blocks.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required ")
      .isObject()
      .withMessage("expects an object"),
    body("data.type")
      .notEmpty()
      .withMessage("required field")
      .isIn(["FLATS", "ROOMS", "MIXED"])
      .withMessage("expects FLATS, ROOMS OR MIXED"),
    body("data.isComposite")
      .default(false)
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body("data.userId").notEmpty().withMessage("required field"),
    body(["data.listingId", "data.addressId"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty"),
    body("data.tags")
      .notEmpty()
      .withMessage("required field")
      .isArray({ min: 1 })
      .withMessage("expects an array of min length 1"),
    body(["data.rooms", "data.amenities", "data.documents", "data.flats"])
      .optional()
      .notEmpty()
      .withMessage("required field")
      .isArray({ min: 1 })
      .withMessage("expects an array of min length 1"),
    body([
      "data.rooms.*",
      "data.tags.*",
      "data.amenities.*",
      "data.documents.*",
      "data.flats.*",
    ])
      .notEmpty()
      .isString()
      .withMessage("expects a string"),
  ],
  controllers.blocks.create,
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
  controllers.blocks.update,
);
router.put("/:id/restore", controllers.blocks.restore);
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
        const { amenities, flats, rooms, documents, tags } = value || {};
        if (!amenities && !flats && !rooms && !documents && !tags) {
          throw new Error("flats, rooms, documents and tags data missing");
        }
        return true;
      }),
    body(["data.amenities", "data.flats", "data.documents", "data.tags"])
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects array >=1 "),
    body([
      "data.amenities.*",
      "data.flats.*",
      "data.documents.*",
      "data.tags.*",
    ])
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects uuid"),
  ],
  controllers.blocks.connections,
);
router.delete("/:id", controllers.blocks.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This blocks resource doesn't exist" });
  return;
});

export default router;
