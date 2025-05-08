import store from "../appState/store.js";

type BEDataHeaderType = {
  errno: Number;
  status: String;
  message: String;
  [key: string]: any;
};

type BEDataType = {
  data?: Array<Record<string, any>>;
  header: BEDataHeaderType;
};

type APIResponseType = {
  error: Boolean;
  data: BEDataType;
};

type RootState = ReturnType<typeof store.getState>;
type AppDispatchType = typeof store.dispatch;

type StoreMessageType = {
  type: "error" | "success" | "info" | "warning" | "neutral";
  role: "alert" | "notification";
  title?: string;
  description: string;
  details?: Array<Record<string, any>>;
  [key: string]: any;
};

type AuthStateType = {
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  showMessage: boolean;
  user: Record<string, any> | null;
  message: StoreMessageType | null;
};

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  [key: string]: any;
};

export type {
  AppDispatchType,
  AuthStateType,
  RootState,
  BEDataType,
  BEDataHeaderType,
  APIResponseType,
  StoreMessageType,
  UserType,
};
