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


type AuthStateType = {
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  user: Record<string, any> | null;
  error: BEDataType | null;
}

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  [key: string]: any;
}

export type { AppDispatchType, AuthStateType, RootState, BEDataType, BEDataHeaderType, APIResponseType, UserType };
