import express, { Response, Request, Router } from "express";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.delete("/:id", controllers.amenities.delete);
router.post("/", controllers.amenities.create);
router.get("/", controllers.amenities.read);
router.get("/:id", controllers.amenities.read);
router.put("/:id", controllers.amenities.update);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This amenities resource doesn't exist" });
  return;
});

export default router;
