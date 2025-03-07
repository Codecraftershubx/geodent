import { Response, Request } from "express";

const createAmenities = (_: Request, res: Response): void => {
  res.json({ controller: "create amenities", message: "success" });
  return;
};

export default createAmenities;
