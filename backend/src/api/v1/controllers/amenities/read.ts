import { Response, Request } from "express";

const readAmenities = (req: Request, res: Response): void => {
  console.log("read amenities called.", req.path, req.baseUrl, req.originalUrl);
  res.json({ controller: "read amenities", message: "success" });
  return;
};

export default readAmenities;
