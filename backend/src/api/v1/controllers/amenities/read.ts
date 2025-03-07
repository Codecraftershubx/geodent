import { Response, Request } from "express";

const readAmenities = (_: Request, res: Response): void => {
  res.json({ controller: "read amenities", message: "success" });
  return;
};

export default readAmenities;
