import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router: Router = express.Router();

router.get("/", middlewares.validateIsLoggedIn, controllers.amenities.get);
router.get(
  "/:id",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.amenities.get
);
router.post(
  "/",
  [
    body().notEmpty().withMessage("data required"),
    body("name").notEmpty().withMessage("required field"),
    body("description").optional().notEmpty().withMessage("cannot be empty"),
  ],
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.amenities.create
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
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.amenities.update
);

router.delete(
  "/:id",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.amenities.delete
);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This amenity resource doesn't exist" });
  return;
});

export default router;
