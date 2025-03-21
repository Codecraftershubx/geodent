import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import utils from "../../../utils/index.js";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.documents.get);
router.get("/:id", controllers.documents.get);
router.post(
  "/",
  utils.storage.upload.array("files"),
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
          !stateId
        ) {
          throw new Error("no owner Id provided");
        }
        return true;
      })
      .withMessage("expects ownerId"),
    body("data.owner")
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
      ])
      .withMessage("invalid owner passed"),
  ],
  controllers.documents.update,
);

router.put("/:id/restore", controllers.documents.restore);

router.delete("/:id", controllers.documents.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This document resource doesn't exist" });
  return;
});

export default router;
