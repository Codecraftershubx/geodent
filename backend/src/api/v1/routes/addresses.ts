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
      .isInt()
      .withMessage("expects an integer"),
    body(["data.width", "data.length", "data.breadth"])
      .notEmpty()
      .withMessage("required field")
      .isFloat()
      .withMessage("expects float"),
    body(["data.isStandAlone", "isAvailable"])
      .default(true)
      .notEmpty()
      .withMessage("required field")
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body(["isLivingArea"])
      .default(false)
      .notEmpty()
      .withMessage("required field")
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body(["data.flatId", "data.blockId", "data.listingId", "data.addressId"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty field"),
    body(["body.documents", "body.tags"])
      .notEmpty()
      .withMessage("required")
      .isArray()
      .withMessage("expects an array"),
    body(["body.documents.*", "body.tags.*"])
      .isString()
      .withMessage("expects a string"),
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

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This address resource doesn't exist" });
  return;
});

export default router;
