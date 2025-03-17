import { Response, Request, Router } from "express";
import routes from "./routes/index.js";

const router: Router = Router();

router.use("/status", (_: Request, res: Response) => {
  res.json({ status: "OK", apiVersion: "1" });
});
router.use("/address", routes.address);
router.use("/amenities", routes.amenities);
router.use("/auth", routes.auth);
router.use("/cities", routes.cities);
router.use("/countries", routes.countries);
router.use("/documents", routes.document);
router.use("/schools", routes.schools);
router.use("/states", routes.states);
router.use("/users", routes.users);
router.use("/*", (_, res: Response): void => {
  res.status(404).json({
    error: "Resource not found",
  });
  return;
});

export default router;
