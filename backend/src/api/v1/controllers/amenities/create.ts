import { Response, Request } from "express";

const createAmenities = (req: Request, res: Response): void => {
  console.log(
    "create amenities called.",
    req.path,
    req.baseUrl,
    req.originalUrl,
  );
  res.status(201).json({ controller: "create amenities", message: "success" });
  return;
};

export default createAmenities;
