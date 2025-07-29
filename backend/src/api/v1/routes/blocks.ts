import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router: Router = express.Router();

router.get("/", controllers.blocks.get);
router.get("/:id", controllers.blocks.get);
router.post(
  "/",
  [
    body().notEmpty().withMessage("data required "),
    body("type")
      .notEmpty()
      .withMessage("required field")
      .isIn(["FLATS", "ROOMS", "MIXED"])
      .withMessage("expects FLATS, ROOMS OR MIXED"),
    body("isComposite")
      .default(false)
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body("userId").notEmpty().withMessage("required field"),
    body(["listingId", "addressId"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty"),
    body("tags")
      .notEmpty()
      .withMessage("required field")
      .isArray({ min: 1 })
      .withMessage("expects an array of min length 1"),
    body(["rooms", "amenities", "documents", "flats"])
      .optional()
      .notEmpty()
      .withMessage("required field")
      .isArray({ min: 1 })
      .withMessage("expects an array of min length 1"),
    body(["rooms.*", "tags.*", "amenities.*", "documents.*", "flats.*"])
      .notEmpty()
      .isString()
      .withMessage("expects a string"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.blocks.create
);

router.put(
  "/:id",
  [body().notEmpty().withMessage("data is required")],
  middlewares.validateIsLoggedIn,
  controllers.blocks.update
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
    body()
      .notEmpty()
      .withMessage("required")
      .custom((value) => {
        const { amenities, flats, rooms, documents, tags } = value || {};
        if (!amenities && !flats && !rooms && !documents && !tags) {
          throw new Error("flats, rooms, documents and tags data missing");
        }
        return true;
      }),
    body(["amenities", "flats", "documents", "tags"])
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects array >=1 "),
    body(["amenities.*", "flats.*", "documents.*", "tags.*"])
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects uuid"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.blocks.connections
);
router.delete(
  "/:id",
  middlewares.validateIsLoggedIn,
  controllers.blocks.delete
);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This blocks resource doesn't exist" });
  return;
});

export default router;
