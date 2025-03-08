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
export type { TErrNumber, TErrNumbers, THandlerOptions };
