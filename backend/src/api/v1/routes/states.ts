import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.states.get);
router.get("/:id", controllers.states.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body([
      "data.name",
      "data.alpha2Code",
      "data.alpha3Code",
      "data.numericCode",
      "data.countryId",
    ])
      .notEmpty()
      .withMessage("required field"),
    body("data.aka").optional().notEmpty().withMessage("value cannot be empty"),
  ],
  controllers.states.create,
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
  controllers.states.update,
);

router.delete("/:id", controllers.states.delete);
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
        const { cities, schools, documents, listings, tags } = value || {};
        if (!cities && !schools && !documents && !listings && !tags) {
          throw new Error(
            "cities, schools, documents, listings and tags missing",
          );
        }
        return true;
      })
      .withMessage(
        "one of cities, schools, documents, listings or tags required",
      ),
  ],
  controllers.states.connections,
);
router.put("/:id/restore", controllers.states.restore);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This state resource doesn't exist" });
  return;
});

export default router;
