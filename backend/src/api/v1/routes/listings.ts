import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router: Router = express.Router();

router.get("/", controllers.listings.get);
router.get("/:id", controllers.listings.get);
router.post(
  "/",
  [
    body().notEmpty().withMessage("required"),
    body(["shortDescr", "data", "data", "proximity"])
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
    body("type")
      .isIn(["STUDIO", "SELF_CONTAINED", "FLAT", "BLOCK"])
      .withMessage("unknown listing type"),
    body("proximity").isIn(["IN", "NEAR"]).withMessage("unknown proximity"),
    body(["longDescr"])
      .optional()
      .notEmpty()
      .withMessage("expects a value")
      .isString()
      .withMessage("expects a string"),
    body("price").notEmpty().withMessage("required field").toFloat(),
    body("isAvailable")
      .default(true)
      .notEmpty()
      .withMessage("expects a value")
      .toBoolean()
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body(["cityId", "countryId", "stateId", "userId", "schoolId"])
      .notEmpty()
      .withMessage("required field")
      .isUUID()
      .withMessage("expects uuid"),
    body("campusId").optional().isUUID().withMessage("expects uuid"),
    body("tags")
      .notEmpty()
      .withMessage("required")
      .isArray({ min: 1 })
      .withMessage("expects an array >=1 "),
    body("tags.*").isUUID().withMessage("expects a uuid"),
    body().custom((value) => {
      const { rooms, flats, blocks } = value || {};
      if (!rooms && !flats && !blocks) {
        throw new Error("one of blocks, flats or rooms required");
      }
      return true;
    }),
    body(["rooms", "likes", "reviews", "flats", "blocks"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isArray({ min: 1 })
      .withMessage("expects an array >= 1"),
    body(["rooms.*", "likes.*", "reviews.*", "flats.*", "blocks.*"])
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.listings.create
);

router.post(
  "/:id/like",
  // require login
  controllers.listings.like
);

router.post(
  "/:id/review",
  [
    body().notEmpty().withMessage("data required"),
    body("rating")
      .notEmpty()
      .withMessage("required field")
      .isInt({ min: 1, max: 5 })
      .withMessage("expects an int 1 <= n <= 5"),
    body(["message"])
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.reviews.create
);

router.put(
  "/:id",
  [
    body().custom((value) => {
      const deniedValues = [
        "createdAt",
        "updatedAt",
        "documents",
        "likes",
        "reviews",
        "tenants",
        "tags",
        "rooms",
        "flats",
        "blocks",
      ];
      for (let deniedValue of deniedValues) {
        if (value[deniedValue]) {
          if (deniedValue === "createdAt" || deniedValue === "updatedAt") {
            throw new Error(`Not allowed. Cannot modify ${deniedValue}`);
          }
        }
        throw new Error(`use /connections to modify ${deniedValue}`);
      }
    }),
  ],
  middlewares.validateIsLoggedIn,
  controllers.listings.update
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
    body()
      .notEmpty()
      .withMessage("data required")
      .custom((value) => {
        const {
          likes,
          reviews,
          tenants,
          rooms,
          flats,
          blocks,
          documents,
          tags,
        } = value || {};
        if (
          !likes &&
          !reviews &&
          !tenants &&
          !rooms &&
          !flats &&
          !blocks &&
          !documents &&
          !tags
        ) {
          throw new Error("target data required");
        }
        return true;
      }),
    body([
      "likes",
      "reviews",
      "tenants",
      "rooms",
      "flats",
      "blocks",
      "documents",
      "tags",
    ])
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects an array >=1 "),
    body([
      "likes.*",
      "reviews.*",
      "tenants.*",
      "rooms.*",
      "flats.*",
      "blocks.*",
      "documents.*",
      "tags.*",
    ])
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.listings.connections
);
router.put(
  "/:id/restore",
  middlewares.validateIsLoggedIn,
  controllers.listings.restore
);
router.delete(
  "/:id",
  middlewares.validateIsLoggedIn,
  controllers.listings.delete
);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This listing resource doesn't exist" });
  return;
});

export default router;
