import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.flats.get);
router.get("/:id", controllers.flats.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body(["data.isStandAlone", "data.isComposite"])
      .default(true)
      .notEmpty()
      .withMessage("required field")
      .isBoolean({ strict: true })
      .withMessage("expects true/false"),
    body("data.userId").notEmpty().withMessage("required field"),
    body(["data.blockId", "data.listingId", "data.addressId"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty"),
    body(["data.tags", "data.rooms", "data.amenities"])
      .notEmpty()
      .withMessage("required field")
      .isArray()
      .withMessage("expects an array"),
    body(["data.tags.*", "data.rooms.*", "data.amenities.*"])
      .notEmpty()
      .isString()
      .withMessage("expects a string"),
    body(["data.documents"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isArray()
      .withMessage("expects an array"),
    body(["data.documents.*"])
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .withMessage("expects a string"),
  ],
  controllers.flats.create,
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
  controllers.flats.update,
);
router.put("/:id/restore", controllers.flats.restore);
router.delete("/:id", controllers.flats.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This flat resource doesn't exist" });
  return;
});

export default router;
