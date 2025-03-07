import { Response, Request } from "express";

const deleteAmenities = (_: Request, res: Response): void => {
  res.json({ controller: "readuser", message: "success" });
  return;
};

export default deleteAmenities;
