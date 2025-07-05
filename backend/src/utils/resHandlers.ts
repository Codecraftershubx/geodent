import { Response, Request } from "express";
import config from "../config.js";
import type { THandlerOptions } from "./types.js";

// globals
const errStatus = "failed";
const successStatus = "success";
const errnos = config.errnos;

// success response handler
const success = (
  req: Request,
  res: Response,
  options: THandlerOptions = {
    data: [],
    status: errnos.success.statusCode || 200,
    message: "successful operation",
  }
): void => {
  const status = options?.status ?? errnos.success.statusCode;
  const data = options.data;
  const toDelete = ["data", "message", "status"];
  const message = options?.message ?? errnos.success.desc;
  for (let key of toDelete) {
    delete (options as Record<string, any>)[key];
  }

  const payload = {
    header: {
      status: successStatus,
      errno: errnos.success.code,
      message,
      ...options,
    },
    data,
  };
  delete req.body?.auth;
  res.status(status).json(payload);
  return;
};

// error response handler
const error = (
  req: Request,
  res: Response,
  errType: string,
  options: THandlerOptions
): void => {
  const toDelete = ["data", "message", "status"];
  const message = options.message ?? errnos[errType].desc;
  const statusCode = options.status ?? errnos[errType].statusCode;
  const data = options.data || [];

  // Remove internally used options
  for (let key of toDelete) {
    delete (options as Record<string, any>)[key];
  }

  const payload = {
    header: {
      status: errStatus,
      errno: errnos[errType].code,
      message,
      ...options,
    },
    errors: data,
  };
  console.log(payload);
  delete req.body?.auth;
  res.status(statusCode).json(payload);
  return;
};

// export
const handlers = {
  success,
  error,
};

export default handlers;
