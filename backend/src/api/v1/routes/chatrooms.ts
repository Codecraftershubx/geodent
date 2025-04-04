import express, { NextFunction, Response, Request, Router } from "express";
import { body, query } from "express-validator";
import validator from "validator";
import controllers from "../controllers/index.js";
import utils from "../../../utils/index.js";

const router: Router = express.Router();

router.get(
  "/",
  [
    query("type")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isIn(["GROUP", "PRIVATE"])
      .withMessage("unknown chatroom type"),
  ],
  controllers.chatroom.get,
);
router.get("/:id", controllers.chatroom.get);
router.get("/:id/messages", controllers.chatroom.messages.get);
router.get("/:id/messages/:messageId", controllers.chatroom.messages.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object")
      .custom((value) => {
        const allowedValues = ["name", "type", "webClientId"];
        const keys = Object.keys(value);
        for (let key of keys) {
          if (!allowedValues.includes(key)) {
            throw new Error(`Denied. ${key} not allowed on creation`);
          }
        }
        return true;
      }),
    body("data.webClientId")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty"),
    body("data.name")
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
    body("data.type")
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string")
      .isIn(["GROUP", "PRIVATE"])
      .withMessage("unknown chatroom type"),
  ],
  controllers.chatroom.create,
);
router.post(
  "/:id/messages",
  utils.storage.upload.array("files"),
  [
    body().custom((value) => {
      // check if it's an object
      if (
        !value ||
        Object.prototype.toString.call(value) !== "[object Object]"
      ) {
        throw new Error("expects an object");
      }
      // check if has senderId and with keys
      if (!Object.keys(value).length || !value["senderId"]) {
        throw new Error("senderId required");
      }
      // validate senderId is UUID
      if (!validator.isUUID(value["senderId"])) {
        throw new Error("expects a uuid");
      }
      if (
        (value["content"] &&
          Object.prototype.toString.call(value["content"]) !==
            "[object String]") ||
        !value["content"].length
      ) {
        throw new Error("cannot be empty");
      }
      return true;
    }),
  ],
  (req: Request, _: Response, next: NextFunction) => {
    req.body.owner = "MESSAGE";
    next();
  },
  controllers.chatroom.messages.create,
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
        const allowedValues = ["name", "type", "webClientId"];
        const keys = Object.keys(value);
        for (let key of keys) {
          if (
            key === "messages" ||
            key === "documents" ||
            key === "participants"
          ) {
            throw new Error(`use /chatrooms/:id/${key} to modify`);
          }
          if (!allowedValues.includes(key)) {
            throw new Error(`Denied. Cannot modify ${key}`);
          }
        }
        return true;
      }),
    body("data.webClientId")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty"),
    body("data.name")
      .optional()
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
    body("data.type")
      .optional()
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string")
      .isIn(["GROUP", "PRIVATE"])
      .withMessage("unknown chatroom type"),
  ],
  controllers.chatroom.update,
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
        const { participants, documents } = value || {};

        // verify at least one is provided
        if (!participants && !documents) {
          throw new Error("no relation provided");
        }
        return true;
      })
      .withMessage("at least one relation needed for connection"),
    body(["data.participants", "data.documents"])
      .optional()
      .isArray({ min: 1 })
      .withMessage("expects an array"),
    body(["data.participants.*", "data.documents.*"])
      .isUUID()
      .withMessage("expects uuid"),
  ],
  controllers.chatroom.connections,
);
router.put("/:id/messages/:messageId", controllers.chatroom.messages.update);
router.put("/:id/restore", controllers.chatroom.restore);
router.put(
  "/:id/messages/:messageId/restore",
  controllers.chatroom.messages.restore,
);
router.delete("/:id", controllers.chatroom.delete);
router.delete("/:id/messages/:messageId", controllers.chatroom.messages.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This chatroom resource doesn't exist" });
  return;
});

export default router;
