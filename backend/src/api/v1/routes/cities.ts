import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router: Router = express.Router();

router.get(
  "/",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.cities.get
);
router.get(
  "/:id",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.cities.get
);
router.post(
  "/",
  [
    body().notEmpty().withMessage("data required"),
    body(["name", "stateId"]).notEmpty().withMessage("required field"),
    body("aka").optional().notEmpty().withMessage("value cannot be empty"),
  ],
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.cities.create
);

router.put(
  "/:id",
  [body().notEmpty().withMessage("data required")],
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.cities.update
);

router.delete(
  "/:id",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.cities.delete
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
    body()
      .notEmpty()
      .withMessage("required")
      .custom((value) => {
        const { listings, schools, documents, tags } = value || {};
        if (!listings && !schools && !documents && !tags) {
          throw new Error("listings, schools, documents and tags missing");
        }
        return true;
      }),
    body(["listings", "schools", "documents", "tags"])
      .optional()
      .notEmpty()
      .isArray({ min: 1 })
      .withMessage("expects array"),
    body(["listings.*", "schools.*", "documents.*", "tags.*"])
      .notEmpty()
      .withMessage("cannot be empty")
      .isUUID()
      .withMessage("expects uuid"),
  ],
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.cities.connections
);
router.put(
  "/:id/restore",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.cities.restore
);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This city resource doesn't exist" });
  return;
});

export default router;
