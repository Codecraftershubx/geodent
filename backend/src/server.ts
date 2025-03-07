import express, { Request, Response } from "express";
import config from "./config.js";
import routers from "./routes/index.js";

const app = express();
const port = config.serverPort;

app.use(express.json());
app.use("/users", routers.users);

app.use("/", (_: Request, res: Response): void => {
  res.json({ status: "okay" });
  return;
});

app.use("/*", (_, res: Response): void => {
  res.status(404).json({
    error: "Resource not found",
  });
  return;
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
