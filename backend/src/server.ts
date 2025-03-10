import express, { Request, Response } from "express";
import config from "./config.js";
import apis from "./api/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = config.serverPort || 8081;

app.use(cors({ origin: "http://0.0.0.0:5001", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", apis.v1);
app.use("/*", (_: Request, res: Response): void => {
  res.status(404).json({
    error: "Resource not found",
  });
  return;
});

app.listen(port, "0.0.0.0", () => {
  console.log("Server listening on port", port);
});
