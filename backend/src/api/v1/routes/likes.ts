import express, { Response, Request, Router } from "express";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.likes.get);
router.get("/:id", controllers.likes.get);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This like resource doesn't exist" });
  return;
});

export default router;
