import { AxiosError } from "axios";

type TBEDataHeader = {
  errno: Number;
  status: String;
  message: String;
  [key: string]: any;
};

type TBEData = {
  data?: Array<Record<string, any>>;
  header: TBEDataHeader;
};

type TBEResponse = {
  error: Boolean;
  data: TBEData;
};

export type { TBEData, TBEDataHeader, TBEResponse };
