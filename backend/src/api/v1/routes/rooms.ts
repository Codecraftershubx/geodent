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
    body("data.number")
      .notEmpty()
      .withMessage("required field")
      .isInt()
      .withMessage("expects an integer"),
    body(["data.width", "data.length", "data.height"])
      .notEmpty()
      .withMessage("required field")
      .isFloat()
      .withMessage("expects float"),
    body(["data.isStandAlone"])
      .default(true)
      .notEmpty()
      .withMessage("required field")
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body(["isLivingArea"])
      .default(false)
      .notEmpty()
      .withMessage("required field")
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body(["data.flatId", "data.blockId", "data.listingId", "data.addressId"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty field"),
    body("data.userId").notEmpty().withMessage("cannot be empty"),
    body(["data.tags"])
      .notEmpty()
      .withMessage("required")
      .isArray()
      .withMessage("expects an array"),
    body(["data.tags.*"]).isString().withMessage("expects a string"),
    body(["data.amenities", "data.documents"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isArray()
      .withMessage("expects an array"),
    body(["data.amenities.*", "data.documents.*"])
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .withMessage("expects a string"),
  ],
  controllers.rooms.create,
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
        const { amenities, documents, tags } = value || {};
        if (!amenities && !documents && !tags) {
          throw new Error("documents and tags data missing");
        }
        return true;
      }),
    body(["data.amenities", "data.documents", "data.tags"])
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects an array >=1 "),
    body(["data.amenities.*", "data.documents.*", "data.tags.*"])
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
