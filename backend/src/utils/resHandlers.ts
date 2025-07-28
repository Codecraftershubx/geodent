import { Response, Request } from "express";
import config from "../config.js";
import type { THandlerOptions, TRequestResData } from "./types.js";
import type { TErrorNumbers, TErrorNumberType } from "../config.js";

// globals
const errStatus: string = "failed";
const successStatus: string = "success";
const errors: TErrorNumbers = config.errors;

type TOmitStatus = Omit<Record<string, any>, "status">;

// success response handler
const success = (
  req: Request,
  res: Response,
  options: THandlerOptions = {
    data: [],
    status: 200,
    message: "successful operation",
  }
): void => {
  const errKey = options?.errno ?? "default";
  const resStatus = options?.status ?? errors.success[errKey].statusCode;
  const data = options.data;
  const toDelete = ["data", "message", "status"];
  const message = options?.message ?? errors.success[errKey].desc;
  for (let key of toDelete) {
    delete (options as Record<string, any>)[key];
  }

  const payload: TRequestResData = {
    header: {
      status: successStatus,
      errno: errors.success[errKey].code,
      message,
      ...(options as TOmitStatus),
    },
    data,
  };
  delete req.body?.auth;
  res.status(resStatus).json(payload);
  return;
};

/**
 * @function error
 * @description Generic Error resoponse handler
 * Its purpose is to standardise backend response for consistency
 * @param { object } req express request object
 * @param { object } res express response object
 * @returns { void }
 */
const error = (
  req: Request,
  res: Response,
  errType: TErrorNumberType,
  options: THandlerOptions
): void => {
  const toDelete = ["data", "message", "status"];
  // construct error message in the form:
  // Title: message
  const errKey = options?.errno ?? "default";
  const errno = errors[errType][errKey].statusCode;
  const message = errors[errType][errKey].desc;
  const statusCode = options.status ?? errors[errType][errKey].statusCode;
  const data = options.data;
  const dataLength = data?.length ?? 0;

  // Remove internally used options
  for (let key of toDelete) {
    delete (options as Record<string, any>)[key];
  }
  // construct response payload
  const payload: TRequestResData = {
    header: {
      status: errStatus,
      errno,
      message,
      ...(options as TOmitStatus),
    },
  };
  if (process.env.NODE_ENV === "dev" && data && dataLength) {
    payload.header.details = {};
    for (let [key, value] of Object.entries(data[0].details)) {
      payload.header.details[key] = value;
    }
    if (data[0]?.details?.stack) {
      payload.header.details.stack = data[0].details.stack;
    }
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
