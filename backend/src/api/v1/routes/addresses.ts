import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.address.get);
router.get("/:id", controllers.address.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body("data.number")
      .notEmpty()
      .withMessage("required field")
      .isInt({ min: 1 })
      .withMessage("expects an int >=1"),
    body(["data.cityId", "data.stateId", "data.countryId"])
      .notEmpty()
      .withMessage("required")
      .isUUID()
      .withMessage("expects uuid"),
    body(["data.poBox"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isInt()
      .withMessage("expects an integer"),
    body(["data.zip", "data.street"])
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
    body(["data.latitude", "data.longitude"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isFloat()
      .withMessage("expects true/false"),
  ],
  controllers.address.create,
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
  controllers.address.update,
);

router.delete("/:id", controllers.address.delete);
router.put("/:id/restore", controllers.address.restore);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This address resource doesn't exist" });
  return;
});

export default router;
