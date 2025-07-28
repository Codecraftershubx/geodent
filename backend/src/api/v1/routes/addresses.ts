import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router: Router = express.Router();

router.get(
  "/",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.address.get
);
router.get("/:id", controllers.address.get);
router.post(
  "/",
  [
    body().notEmpty().withMessage("data required"),
    body("number")
      .notEmpty()
      .withMessage("required field")
      .isInt({ min: 1 })
      .withMessage("expects an int >=1"),
    body(["cityId", "stateId", "countryId"])
      .notEmpty()
      .withMessage("required")
      .isUUID()
      .withMessage("expects uuid"),
    body(["poBox"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isInt()
      .withMessage("expects an integer"),
    body(["zip", "street"])
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
    body(["latitude", "longitude"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isFloat()
      .withMessage("expects true/false"),
  ],
  middlewares.validateIsLoggedIn,
  controllers.address.create
);

router.put(
  "/:id",
  [body().notEmpty().withMessage("data  required")],
  middlewares.validateIsLoggedIn,
  controllers.address.update
);

router.delete(
  "/:id",
  middlewares.validateIsLoggedIn,
  controllers.address.delete
);
router.put(
  "/:id/restore",
  middlewares.validateIsLoggedIn,
  controllers.address.restore
);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This address resource doesn't exist" });
  return;
});

export default router;
