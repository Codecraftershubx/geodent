import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.tags.get);
router.get("/:id", controllers.tags.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body(["data.name", "data.description"])
      .notEmpty()
      .withMessage("required field")
      .isString()
      .withMessage("expects a string"),
    body(["data.rooms", "data.flats", "data.blocks", "data.listings"])
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isArray()
      .withMessage("expects an array"),
    body(["data.rooms.*", "data.flats.*", "data.blocks.*", "data.listings.*"])
      .notEmpty()
      .withMessage("expects one or more ids")
      .isString()
      .withMessage("expects a string"),
  ],
  controllers.tags.create,
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
  controllers.tags.update,
);

router.put("/:id/restore", controllers.tags.restore);
router.delete("/:id", controllers.tags.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This tag resource doesn't exist" });
  return;
});

export default router;
