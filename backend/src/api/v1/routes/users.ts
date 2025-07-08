import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router: Router = express.Router();

router.delete("/:id", controllers.users.delete);
router.get(
  "/",
  [
    query("includes")
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects an array >=1 "),
    query("includes.*")
      .trim()
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .withMessage("expects a string")
      .isIn([
        "documents",
        "chatrooms",
        "likes",
        "likedBy",
        "listings",
        "notifications",
        "tenancy",
        "rentals",
        "reviews",
        "receivedReviews",
        "rooms",
        "flats",
        "blocks",
        "verifications",
      ])
      .withMessage("unsupported value"),
  ],
  controllers.users.get
);
router.get(
  "/me",
  middlewares.validateAuthToken,
  middlewares.validateTokenPayload,
  middlewares.validateIsLoggedIn,
  controllers.users.profile
);
router.get(
  "/:id",
  [
    query("includes")
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects an array >=1 "),
    query("includes.*")
      .trim()
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .withMessage("expects a string")
      .isIn([
        "documents",
        "chatrooms",
        "likes",
        "likedBy",
        "listings",
        "notifications",
        "tenancy",
        "rentals",
        "reviews",
        "receivedReviews",
        "rooms",
        "flats",
        "blocks",
        "verifications",
      ])
      .withMessage("unsupported value"),
  ],
  controllers.users.get
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
  controllers.users.update
);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body(["data.firstName", "data.lastName", "data.email", "data.password"])
      .notEmpty()
      .withMessage("required field"),
    body(["data.isAdmin"])
      .default(false)
      .toBoolean()
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body("data.role").default("USER").isIn(["AGENT", "LANDLORD", "USER"]),
    body("phone")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .withMessage("expects a string"),
    body("data.addressId")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
    body([
      "data.chatrooms",
      "data.likes",
      "data.likedBy",
      "data.listings",
      "data.notifications",
      "data.tenancy",
      "data.rentals",
      "data.reviews",
      "data.receivedReviews",
      "data.messages",
      "data.rooms",
      "data.flats",
      "data.blocks",
      "data.verifications",
    ])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isArray()
      .withMessage("expects an array"),
    body([
      "data.chatrooms.*",
      "data.likes.*",
      "data.likedBy.*",
      "data.listings.*",
      "data.notifications.*",
      "data.tenancy.*",
      "data.rentals.*",
      "data.reviews.*",
      "data.receivedReviews.*",
      "data.messages.*",
      "data.rooms.*",
      "data.flats.*",
      "data.blocks.*",
      "data.verifications.*",
    ])
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
  ],
  controllers.users.create
);
router.post(
  "/:id/like",
  [
    body("data").notEmpty().isObject().withMessage("expects an object"),
    body("data.userId")
      .notEmpty()
      .withMessage("required field")
      .isUUID()
      .withMessage("expects a uuid"),
  ],
  controllers.users.like
);

router.post(
  "/:id/review",
  [
    body("data").notEmpty().isObject().withMessage("expects an object"),
    body("data.reviewerId")
      .notEmpty()
      .withMessage("required field")
      .isUUID()
      .withMessage("expects a uuid"),
    body("data.rating")
      .notEmpty()
      .withMessage("required field")
      .isInt({ min: 1, max: 5 })
      .withMessage("expects an int 1 <= n <= 5"),
    body(["data.message", "data.target"])
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
    body("data.target")
      .isIn(["AGENT", "LANDLORD", "LISTING"])
      .withMessage("invalid value"),
  ],
  controllers.reviews.create
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
        const {
          address,
          documents,
          chatrooms,
          likes,
          likedBy,
          listings,
          notifications,
          tenancy,
          rentals,
          reviews,
          receivedReviews,
          messages,
          rooms,
          flats,
          blocks,
          verifications,
        } = value || {};

        // verify at least one is provided
        if (
          !address &&
          !documents &&
          !chatrooms &&
          !likes &&
          !likedBy &&
          !listings &&
          !notifications &&
          !tenancy &&
          !rentals &&
          !reviews &&
          !receivedReviews &&
          !messages &&
          !rooms &&
          !flats &&
          !blocks &&
          !verifications
        ) {
          throw new Error("no relation provided");
        }
        return true;
      })
      .withMessage("at least one relation needed for connection"),
    body([
      "data.address",
      "data.documents",
      "data.chatrooms",
      "data.likes",
      "data.likedBy",
      "data.listings",
      "data.notifications",
      "data.tenancy",
      "data.rentals",
      "data.reviews",
      "data.receivedReviews",
      "data.messages",
      "data.rooms",
      "data.flats",
      "data.blocks",
      "data.verifications",
    ])
      .optional()
      .isArray()
      .withMessage("expects an array"),
  ],
  controllers.users.connections
);
router.put("/:id/restore", controllers.users.restore);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This users resource doesn't exist" });
  return;
});

export default router;
