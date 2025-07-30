import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import validator from "validator";
import utils from "../../../utils/index.js";
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
  controllers.documents.get
);
router.get("/:id", controllers.documents.get);
router.get(
  "/static/:id",
  [query("download").default(false).toBoolean().isBoolean()],
  controllers.documents.files
);
router.post(
  "/",
  utils.storage.upload.array("files"),
  [
    body("owner")
      .notEmpty()
      .withMessage("required")
      .isIn([
        "CHATROOM",
        "USER",
        "LISTING",
        "VERIFICATION",
        "ROOM",
        "FLAT",
        "BLOCK",
        "SCHOOL",
        "CAMPUS",
        "CITY",
        "COUNTRY",
        "STATE",
        "MESSAGE",
      ])
      .withMessage("invalid owner passed"),
    body().custom((value) => {
      const key = utils.text.lowerCase(value.owner);
      if (!value[key] || !(typeof value[key] === "string")) {
        throw new Error(`${value.owner} id required`);
      }
      if (!validator.isUUID(value[key])) {
        throw new Error(`expects uuid for ${value.owner}`);
      }
      return true;
    }),
  ],
  middlewares.validateIsLoggedIn,
  controllers.documents.create
);
router.put(
  "/:id",
  [
    body()
      .custom((value) => {
        const {
          chatroomId,
          userId,
          listingId,
          verificationId,
          roomId,
          flatId,
          blockId,
          schoolId,
          campusId,
          cityId,
          countryId,
          stateId,
          messageId,
        } = value;
        // verify at least one is provided
        if (
          !chatroomId &&
          !userId &&
          !listingId &&
          !verificationId &&
          !roomId &&
          !flatId &&
          !blockId &&
          !schoolId &&
          !campusId &&
          !cityId &&
          !countryId &&
          !stateId &&
          !messageId
        ) {
          throw new Error("no owner Id provided");
        }
        return true;
      })
      .withMessage("expects ownerId"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.documents.update
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
          chatroom,
          listing,
          user,
          verification,
          room,
          flat,
          block,
          school,
          campus,
          city,
          country,
          state,
        } = value || {};

        // verify at least one is provided
        if (
          !chatroom &&
          !listing &&
          !user &&
          !verification &&
          !room &&
          !flat &&
          !block &&
          !school &&
          !campus &&
          !city &&
          !country &&
          !state
        ) {
          throw new Error("no relation provided");
        }
        return true;
      })
      .withMessage("at least one relation needed for connection"),
    body([
      "chatroom",
      "listing",
      "user",
      "verification",
      "room",
      "flat",
      "block",
      "school",
      "campus",
      "city",
      "country",
      "state",
    ])
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects an array"),
    body([
      "chatroom.*",
      "listing.*",
      "user.*",
      "verification.*",
      "room.*",
      "flat.*",
      "block.*",
      "school.*",
      "campus.*",
      "city.*",
      "country.*",
      "state.*",
    ])
      .isUUID()
      .withMessage("expects uuid"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.documents.connections
);
router.put(
  "/:id/restore",
  middlewares.validateIsLoggedIn,
  controllers.documents.restore
);
router.delete(
  "/:id",
  middlewares.validateIsLoggedIn,
  controllers.documents.delete
);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This document resource doesn't exist" });
  return;
});

export default router;
