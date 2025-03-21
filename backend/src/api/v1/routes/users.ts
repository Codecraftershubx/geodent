import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.delete("/:id", controllers.users.delete);
router.get("/", controllers.users.get);
router.get("/:id", controllers.users.get);
router.put(
  "/:id",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
  ],
  controllers.users.update,
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
  controllers.users.create,
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
  controllers.users.connections,
);
router.put("/:id/restore", controllers.users.restore);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This users resource doesn't exist" });
  return;
});

export default router;
