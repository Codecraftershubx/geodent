import express, { NextFunction, Response, Request, Router } from "express";
import { body, query } from "express-validator";
import validator from "validator";
import controllers from "../controllers/index.js";
import utils from "../../../utils/index.js";
import middlewares from "../middlewares/index.js";

const router: Router = express.Router();

router.get(
  "/",
  [
    query("type")
      .optional()
      .trim()
      .default("PRIVATE")
      .notEmpty()
      .withMessage("cannot be empty")
      .isIn(["GROUP", "PRIVATE"])
      .withMessage("unknown chatroom type"),
  ],
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.chatroom.get
);
router.get("/:id", middlewares.validateIsLoggedIn, controllers.chatroom.get);
router.get(
  "/:id/messages",
  middlewares.validateIsLoggedIn,
  controllers.chatroom.messages.get
);
router.get(
  "/:id/messages/:messageId",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.chatroom.messages.get
);
router.post(
  "/",
  [
    body()
      .notEmpty()
      .withMessage("data required")
      .custom((value) => {
        const allowedValues = ["name", "type"];
        const keys = Object.keys(value);
        for (let key of keys) {
          if (!allowedValues.includes(key)) {
            throw new Error(`Denied. ${key} not allowed on creation`);
          }
        }
        return true;
      }),
    body("name")
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
    body("type")
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string")
      .isIn(["GROUP", "PRIVATE"])
      .withMessage("unknown chatroom type"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.chatroom.create
);
router.post(
  "/:id/messages",
  middlewares.validateIsLoggedIn,
  utils.storage.upload.array("files"),
  [
    body().custom((value) => {
      // check if has senderId and with keys
      if (!value["senderId"]) {
        throw new Error("senderId required");
      }
      // validate senderId is UUID
      if (!validator.isUUID(value["senderId"])) {
        throw new Error("expects a uuid");
      }
      if (
        (value["text"] &&
          Object.prototype.toString.call(value["text"]) !==
            "[object String]") ||
        !value["text"].length
      ) {
        throw new Error("expects non-empty string");
      }
      return true;
    }),
  ],
  (req: Request, _: Response, next: NextFunction) => {
    req.body.owner = "MESSAGE";
    next();
  },
  controllers.chatroom.messages.create
);
router.put(
  "/:id",
  [
    body()
      .notEmpty()
      .withMessage("data required")
      .custom((value) => {
        const allowedValues = ["name", "type"];
        const keys = Object.keys(value);
        for (let key of keys) {
          if (
            key === "messages" ||
            key === "documents" ||
            key === "participants"
          ) {
            throw new Error(
              `use /chatrooms/:id/${key === "messages" ? key : "connections"} to modify`
            );
          }
          if (!allowedValues.includes(key)) {
            throw new Error(`Denied. Cannot modify ${key}`);
          }
        }
        return true;
      }),
    body("name")
      .optional()
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
    body("type")
      .optional()
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string")
      .isIn(["GROUP", "PRIVATE"])
      .withMessage("unknown chatroom type"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.chatroom.update
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
        const { participants, documents } = value || {};

        // verify at least one is provided
        if (!participants && !documents) {
          throw new Error("no relation provided");
        }
        return true;
      })
      .withMessage("at least one relation needed for connection"),
    body(["participants", "documents"])
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects an array"),
    body(["participants.*", "documents.*"])
      .isUUID()
      .withMessage("expects uuid"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.chatroom.connections
);
router.put("/:id/messages/:messageId", controllers.chatroom.messages.update);
router.put("/:id/restore", controllers.chatroom.restore);
router.put(
  "/:id/messages/:messageId/restore",
  controllers.chatroom.messages.restore
);
router.delete(
  "/:id",
  middlewares.validateIsLoggedIn,
  controllers.chatroom.delete
);
router.delete("/:id/messages/:messageId", controllers.chatroom.messages.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This chatroom resource doesn't exist" });
  return;
});

export default router;
