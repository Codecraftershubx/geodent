import express, { Response, Request, Router } from "express";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.post("/", controllers.users.create);
router.get("/", controllers.users.read);
router.post("/:id/delete", controllers.users.delete);
router.put("/:id/update", controllers.users.update);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This users resource doesn't exist" });
  return;
});

export default router;
