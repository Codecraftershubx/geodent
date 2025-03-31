import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.rentals.get);
router.get("/:id", controllers.rentals.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object")
      .custom((value) => {
        const allowedValues = [
          "listingId",
          "amountPaid",
          "tenants",
          "reason",
          "startsAt",
          "endsAt",
          "priceIsDifferent",
        ];
        const keys = Object.keys(value);
        for (let key of keys) {
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
            throw new Error("'priceIsDifferent' must have 'reason'");
          }
        }
        return true;
      }),
    body(["data.listingId"])
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
    body("data.tenants")
      .notEmpty()
      .withMessage("required field")
      .isArray({ min: 1 })
      .withMessage("expects an array >= 1"),
    body("data.tenants.*")
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
    body("data.amountPaid")
      .notEmpty()
      .withMessage("required field")
      .isFloat({ gt: 0 })
      .withMessage("expects a float > 0"),
    body("data.priceIsDifferent")
      .default(false)
      .notEmpty()
      .withMessage("cannot be empty")
      .toBoolean()
      .isBoolean({ strict: true })
      .withMessage("expects true/false "),
    body("data.reason")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .withMessage("expects a string"),
    body(["data.startsAt", "data.endsAt"])
      .notEmpty()
      .withMessage("required field")
      .isISO8601()
      .withMessage("expects an iso date string. (e.g. 2023-01-01T00:00:00Z)"),
  ],
  controllers.rentals.create,
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
        const allowedValues = [
          "listingId",
          "amountPaid",
          "priceIsDifferent",
          "reason",
          "startsAt",
          "endsAt",
        ];
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
        console.log("validator...about to return");
        return true;
      }),
    body(["data.listingId", "data.landlordId"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
    body("data.amountPaid")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isFloat({ gt: 0 })
      .withMessage("expects a float > 0"),
    body("data.priceIsDifferent")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .toBoolean()
      .isBoolean({ strict: true })
      .withMessage("expects true/false "),
    body("data.reason")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .withMessage("expects a string"),
    body(["data.startsAt", "data.endsAt"])
      .optional()
      .notEmpty()
      .withMessage("required field")
      .isISO8601()
      .withMessage("expects an ISO date string. (e.g. 2023-01-01T00:00:00Z)"),
  ],
  controllers.rentals.update,
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
        const { tenants } = value || {};
        if (!tenants) {
          throw new Error("no tenants data missing");
        }
        return true;
      }),
    body("data.tenants.*")
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects a uuid"),
  ],
  controllers.rentals.connection,
);
router.put("/:id/restore", controllers.rentals.restore);
router.delete("/:id", controllers.rentals.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This rentals resource doesn't exist" });
  return;
});

export default router;
