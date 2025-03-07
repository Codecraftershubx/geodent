import { Response, Request } from "express";

const updateAmenities = (_: Request, res: Response): void => {
  res.json({ controller: "update amenities", message: "success" });
  return;
};

export default updateAmenities;
