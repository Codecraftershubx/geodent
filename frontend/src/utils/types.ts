import store from "../appState/store.js";

type BEDataHeaderType = {
  errno: Number;
  status: String;
  message: String;
  details?: Record<string, any>;
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

type MessageType = {
  type: "error" | "success" | "info" | "warning" | "neutral";
  role: "alert" | "notification";
  title?: string;
  description: string;
};

type AuthStateType = {
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  showMessage: boolean;
  user: Record<string, any> | null;
  message: MessageType | null;
};

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  [key: string]: any;
};

type LoginSuccessPaylodType = {
  accessToken: string;
};

type RefreshSuccessPayloadType = LoginSuccessPaylodType;

export type {
  APIResponseType,
  AppDispatchType,
  AuthStateType,
  BEDataType,
  BEDataHeaderType,
  LoginSuccessPaylodType,
  MessageType,
  RefreshSuccessPayloadType,
  RootState,
  UserType,
};
