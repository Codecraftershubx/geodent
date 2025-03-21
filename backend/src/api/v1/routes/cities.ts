import express, { Response, Request, Router } from "express";
import { body, query } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.cities.get);
router.get("/:id", controllers.cities.get);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body(["data.name", "data.stateId"])
      .notEmpty()
      .withMessage("required field"),
    body("data.aka").optional().notEmpty().withMessage("value cannot be empty"),
  ],
  controllers.cities.create,
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
  controllers.cities.update,
);

router.delete("/:id", controllers.cities.delete);
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
        const { listings, schools, documents, tags } = value || {};
        if (!listings && !schools && !documents && !tags) {
          throw new Error("listings, schools, documents and tags missing");
        }
        return true;
      })
      .withMessage("one of listings, schools, documents or tags required"),
  ],
  controllers.cities.connections,
);
router.put("/:id/restore", controllers.cities.restore);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This city resource doesn't exist" });
  return;
});

export default router;
