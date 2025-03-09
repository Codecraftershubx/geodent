// error numbers object type

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

type TAccessTokenPayload = {
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
  TAccessTokenPayload,
  TErrNumber,
  TErrNumbers,
  THandlerOptions,
  TUserData,
};
