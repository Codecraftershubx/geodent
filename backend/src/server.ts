import express, { Request, Response } from "express";
import config from "./config.js";
import apis from "./api/index.js";

const app = express();
const port = config.serverPort;

app.use(express.json());
app.use("/api/v1", apis.v1);

app.use("/*", (_, res: Response): void => {
  res.status(404).json({
    error: "Resource not found",
  });
  return;
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
