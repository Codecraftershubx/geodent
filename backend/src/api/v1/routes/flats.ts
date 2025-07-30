import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router: Router = express.Router();

router.get(
  "/",
  [
    body("ids")
      .optional()
      .notEmpty()
      .withMessage("can't be empty")
      .custom((value) => {
        const len = value.length;
        switch (len) {
          case 0:
            throw new Error("cannot be empty");
          case 1:
            throw new Error("expects 2+ ids. Use /:id endpoint instead");
          default:
            return true;
        }
      }),
    body("ids.*")
      .trim()
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .isUUID()
      .withMessage("expects uuid"),
  ],
  controllers.flats.get
);
router.get("/:id", controllers.flats.get);
router.post(
  "/",
  [
    body("data").notEmpty().withMessage("data required"),
    body(["isStandAlone", "isComposite"])
      .default(true)
      .notEmpty()
      .withMessage("required field")
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body("userId").notEmpty().withMessage("required field"),
    body(["blockId", "listingId", "addressId"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty"),
    body(["tags", "rooms", "amenities"])
      .notEmpty()
      .withMessage("required field")
      .isArray()
      .withMessage("expects an array"),
    body(["tags.*", "rooms.*", "amenities.*"])
      .notEmpty()
      .isString()
      .withMessage("expects a string"),
    body(["documents"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isArray()
      .withMessage("expects an array"),
    body(["documents.*"])
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .withMessage("expects a string"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.flats.create
);

router.put(
  "/:id",
  [body().notEmpty().withMessage("data is required")],
  middlewares.validateIsLoggedIn,
  controllers.flats.update
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
      .withMessage("required")
      .custom((value) => {
        const { amenities, rooms, documents, tags } = value || {};
        if (!amenities && !rooms && !documents && !tags) {
          throw new Error("rooms, documents and tags data missing");
        }
        return true;
      }),
    body(["amenities", "rooms", "documents", "tags"])
      .optional()
      .isArray({ min: 1 })
      .withMessage("expecs an array >=1 "),
    body(["amenities.*", "rooms.*", "documents.*", "tags.*"])
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.flats.connections
);
router.put(
  "/:id/restore",
  middlewares.validateIsLoggedIn,
  controllers.flats.restore
);
router.delete("/:id", middlewares.validateIsLoggedIn, controllers.flats.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This flat resource doesn't exist" });
  return;
});

export default router;
