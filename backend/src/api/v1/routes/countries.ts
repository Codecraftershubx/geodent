import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router: Router = express.Router();

router.get(
  "/",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.countries.get
);
router.get(
  "/:id",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.countries.get
);
router.post(
  "/",
  [
    body().notEmpty().withMessage("data is required"),
    body([
      "name",
      "alpha2Code",
      "alpha3Code",
      "currency",
      "currencyCode",
      "numericCode",
    ])
      .notEmpty()
      .withMessage("required field"),
    body("aka").optional().notEmpty().withMessage("value cannot be empty"),
  ],
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.countries.create
);

router.put(
  "/:id",
  [body().notEmpty().withMessage("data is required")],
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.countries.update
);

router.delete(
  "/:id",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.countries.delete
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
        const { listings, documents, schools, tags } = value || {};
        if (!listings && !documents && !schools && !tags) {
          throw new Error("listings, documents, schools and tags missing");
        }
        return true;
      }),
  ],
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.countries.connections
);

router.put(
  "/:id/restore",
  middlewares.validateIsLoggedIn,
  middlewares.validateIsAdmin,
  controllers.countries.restore
);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This country resource doesn't exist" });
  return;
});

export default router;
