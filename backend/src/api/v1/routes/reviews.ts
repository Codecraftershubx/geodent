import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.reviews.get);
router.get("/:id", controllers.reviews.get);
router.put(
  "/:id",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object")
      .custom((value) => {
        const deniedValues = [
          "createdAt",
          "updatedAt",
          "isDeleted",
          "likes",
          "reviewer",
          "listing",
          "user",
          "deletedAt",
        ];
        for (let key of Object.keys(value)) {
          if (deniedValues.includes(key)) {
            throw new Error(`Not allowed. Cannot modify ${key}`);
          }
        }
        return true;
      }),
    body("data.rating")
      .optional()
      .notEmpty()
      .withMessage("cannot be empty")
      .isInt({ min: 1, max: 5 })
      .withMessage("expects an integer 1 <= n <= 5"),
  ],
  controllers.reviews.update,
);
router.put("/:id/restore", controllers.reviews.restore);
router.delete("/:id", controllers.reviews.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This review resource doesn't exist" });
  return;
});

export default router;
