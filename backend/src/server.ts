import express, { NextFunction, Request, Response } from "express";
import config from "./config.js";
import apis from "./api/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = config.serverPort || 8081;

app.use(
  cors({
    origin: [
      "http://localhost:5001",
      "http://192.168.0.10:5001",
      "http://192.168.8.10:5001",
      "http://127.0.0.1:80",
      "http://localhost:80",
    ],
    credentials: true,
  })
);
// add needed middlewares across api
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// add base prop to req for all requests
app.use((req: Request, _: Response, next: NextFunction) => {
  req.body.timestamp = new Date();
  req.body.auth = {
    strictMode: true,
  };
  next();
});
// route api/v1 requests
app.use(
  "/api/v1",
  (_: Request, __: Response, next: NextFunction) => {
    console.log("/api/v1 root called");
    next();
  },
  apis.v1
);
// handle 404
app.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({
    error: "Resource not found",
  });
  return;
});

app.listen(port, "0.0.0.0", () => {
  console.log("Server listening on port", port);
});
