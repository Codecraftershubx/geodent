import express, { Response, Request, Router } from "express";
import { body } from "express-validator";
import utils from "../../../utils/index.js";
import controllers from "../controllers/index.js";

const router: Router = express.Router();

router.get("/", controllers.documents.get);
router.get("/:id", controllers.documents.get);
router.post(
  "/",
  utils.storage.upload.array("files"),
  controllers.documents.create,
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
  controllers.documents.update,
);

router.put("/:id/restore", controllers.documents.restore);

router.delete("/:id", controllers.documents.delete);

router.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({ error: "This document resource doesn't exist" });
  return;
});

export default router;
