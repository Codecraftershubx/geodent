import { Response, Request } from "express";

const updateAmenities = (req: Request, res: Response): void => {
  console.log(
    "update amenities called.",
    req.path,
    req.baseUrl,
    req.originalUrl,
  );
  res.json({ controller: "update amenities", message: "success" });
  return;
};

export default updateAmenities;
