import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import validator from "validator";
import utils from "../../../utils/index.js";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.documents.get);
router.get("/:id", controllers.documents.get);
router.get(
  "/static/:id",
  [query("download").default(false).toBoolean().isBoolean()],
  controllers.documents.files,
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
      if (
        !value[key] ||
        !(typeof value[key] === "string") ||
        !validator.isUUID(value[key])
      ) {
        throw new Error(`'${key}' id required for owner ${value.owner}`);
      }
      return true;
    }),
  ],
  controllers.documents.create,
);
router.put(
  "/:id",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object")
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
  controllers.documents.update,
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
      "data.chatroom",
      "data.listing",
      "data.user",
      "data.verification",
      "data.room",
      "data.flat",
      "data.block",
      "data.school",
      "data.campus",
      "data.city",
      "data.country",
      "data.state",
    ])
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects an array"),
    body([
      "data.chatroom.*",
      "data.listing.*",
      "data.user.*",
      "data.verification.*",
      "data.room.*",
      "data.flat.*",
      "data.block.*",
      "data.school.*",
      "data.campus.*",
      "data.city.*",
      "data.country.*",
      "data.state.*",
    ])
      .isUUID()
      .withMessage("expects uuid"),
  ],
  controllers.documents.connections,
);
router.put("/:id/restore", controllers.documents.restore);
router.delete("/:id", controllers.documents.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This document resource doesn't exist" });
  return;
});

export default router;
