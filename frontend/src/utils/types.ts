import { AxiosError } from "axios";
import store from "../appState/store.js";

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

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export type { AppDispatch, RootState, TBEData, TBEDataHeader, TBEResponse };
