import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.delete("/:id", controllers.users.delete);
router.get("/", controllers.users.read);
router.get("/:id", controllers.users.read);
router.put(
  "/:id",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
  ],
  controllers.users.update,
);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body(["data.firstName", "data.lastName", "data.email", "data.password"])
      .notEmpty()
      .withMessage("required field"),
    body("data.role").default("USER"),
  ],
  controllers.users.create,
);
router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This users resource doesn't exist" });
  return;
});

export default router;
