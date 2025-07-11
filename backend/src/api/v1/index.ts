import { Response, Request, Router, NextFunction } from "express";
import routes from "./routes/index.js";

const router: Router = Router();

router.get(["/status", "/"], (_: Request, res: Response) => {
  console.log("status check endpoint called");
  res.json({ status: "OK", apiVersion: "1" });
  return;
});
router.use("/address", routes.address);
router.use("/amenities", routes.amenities);
router.use("/auth", routes.auth);
router.use("/blocks", routes.blocks);
router.use("/chatrooms", routes.chatrooms);
router.use("/cities", routes.cities);
router.use("/countries", routes.countries);
router.use("/documents", routes.document);
router.use("/flats", routes.flats);
router.use("/likes", routes.likes);
router.use("/listings", routes.listings);
router.use("/notifications", routes.notifications);
router.use("/rentals", routes.rentals);
router.use("/reviews", routes.reviews);
router.use("/rooms", routes.rooms);
router.use("/schools", routes.schools);
router.use("/states", routes.states);
router.use("/tags", routes.tags);
router.use("/users", routes.users);
router.use("/*", (_, res: Response): void => {
  res.status(404).json({
    error: "Resource not found",
  });
  return;
});

export default router;
