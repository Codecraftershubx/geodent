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
};
export type { TErrNumber, TErrNumbers, THandlerOptions };
