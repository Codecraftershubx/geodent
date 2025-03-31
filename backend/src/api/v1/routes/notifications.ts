import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.notifications.get);
router.get("/:id", controllers.notifications.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object")
      .custom((value) => {
        const allowedValues = ["receiverId", "message"];
        const keys = Object.keys(value);
        for (let key of keys) {
          if (!allowedValues.includes(key)) {
            throw new Error(`Denied. Cannot modify ${key}`);
          }
        }
        return true;
      }),
    body("data.receiverId")
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
    body("data.message")
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
  ],
  controllers.notifications.create,
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
        const allowedValues = ["message", "isRead"];
        const keys = Object.keys(value);
        for (let key of keys) {
          if (key === "tenants") {
            throw new Error("use /rentals/:id/connections to modify tenants");
          }
          if (!allowedValues.includes(key)) {
            throw new Error(`Denied. Cannot modify ${key}`);
          }
          if (
            (key === "priceIsDifferent" &&
              value.priceIsDifferent &&
              !keys.includes("reason")) ||
            (key === "reason" &&
              (!keys.includes("priceIsDifferent") || !value.priceIsDifferent))
          ) {
            throw new Error("priceIsDifferent requires a reason");
          }
        }
        return true;
      }),
    body("data.message")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .withMessage("expects a string"),
    body("data.isRead")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .toBoolean()
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
  ],
  controllers.notifications.update,
);
router.put("/:id/restore", controllers.notifications.restore);
router.delete("/:id", controllers.notifications.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This notifications resource doesn't exist" });
  return;
});

export default router;
