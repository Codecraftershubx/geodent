import { Response, Request } from "express";

const deleteAmenities = (req: Request, res: Response): void => {
  console.log(
    "delete amenities called.",
    req.path,
    req.baseUrl,
    req.originalUrl,
  );
  res.json({ controller: "delete amenities", message: "success" });
  return;
};

export default deleteAmenities;
