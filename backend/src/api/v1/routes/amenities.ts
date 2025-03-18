import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.amenities.get);
router.get("/:id", controllers.amenities.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body("data.name").notEmpty().withMessage("required field"),
    body("data.description")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty"),
  ],
  controllers.amenities.create,
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
  controllers.amenities.update,
);

router.delete("/:id", controllers.amenities.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This amenity resource doesn't exist" });
  return;
});

export default router;
