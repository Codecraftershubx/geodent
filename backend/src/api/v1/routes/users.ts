import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.delete("/:id", controllers.users.delete);
router.post(
  "/",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("expects an object"),
    body([
      "data.firstName",
      "data.lastName",
      "data.password",
      "data.phone",
      "data.email",
    ])
      .notEmpty()
      .withMessage("required field"),
  ],
  controllers.users.create,
);
router.get("/", controllers.users.read);
router.get("/:id", controllers.users.read);
router.put("/:id", controllers.users.update);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This users resource doesn't exist" });
  return;
});

export default router;
