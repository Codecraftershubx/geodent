import { Response, Request } from "express";
import config from "../config.js";
import type { THandlerOptions, TRequestResData } from "./types.js";

// globals
const errStatus: string = "failed";
const successStatus: string = "success";
const errnos = config.errnos;

type TOmitStatus = Omit<Record<string, any>, "status">;

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
  const resStatus = options?.status ?? errnos.success.statusCode;
  const data = options.data;
  const toDelete = ["data", "message", "status"];
  const message = options?.message ?? errnos.success.desc;
  for (let key of toDelete) {
    delete (options as Record<string, any>)[key];
  }

  const payload: TRequestResData = {
    header: {
      status: successStatus,
      errno: errnos.success.code,
      message,
      ...(options as TOmitStatus),
    },
    data,
  };
  delete req.body?.auth;
  res.status(resStatus).json(payload);
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
  const data = options.data
    ? options.data.length
      ? options.data[0].details
      : {}
    : {};

  // Remove internally used options
  for (let key of toDelete) {
    delete (options as Record<string, any>)[key];
  }

  // construct response payload
  const payload: TRequestResData = {
    header: {
      status: errStatus,
      errno: errnos[errType].code,
      message,
      ...(options as TOmitStatus),
    },
  };
  if (Object.keys(data).length && process.env.NODE_ENV === "dev") {
    payload.header.details = data;
  }

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
