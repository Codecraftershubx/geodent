// error numbers object type
import { JwtPayload } from "jsonwebtoken";

type TDecomposeResult = {
  payload: TPayload | null;
  expired: Boolean;
};
type TErrNumber = {
  code: number;
  desc: string;
  statusCode: number;
};

type TErrNumbers = {
  [key: string]: TErrNumber;
};

type THandlerOptions = {
  status?: number;
  data?: Array<object>;
  message?: String;
  [key: string]: any;
};

type TPayload = {
  id: string;
};

type TUserData = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  [key: string]: Array<any> | boolean | string;
};

export type {
  TDecomposeResult,
  TPayload,
  TErrNumber,
  TErrNumbers,
  THandlerOptions,
  TUserData,
};
