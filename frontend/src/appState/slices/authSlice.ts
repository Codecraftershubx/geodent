import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  AppDispatchType,
  AuthStateType,
  BEDataType,
  StoreMessageType,
  UserType,
} from "../../utils/types.js";
import api from "../../utils/api.js";

type LoginCredentialsType = {
  accessToken?: string | null;
  email?: string | null;
  password?: string | null;
};

// login user
const loginUser = createAsyncThunk<
  UserType,
  LoginCredentialsType,
  { rejectValue: BEDataType; dispatch: AppDispatchType }
>(
  "auth/login",
  async (credentials: LoginCredentialsType, { rejectWithValue, dispatch }) => {
    // console.log("LOGIN THUNK CALLED WITH:", credentials);
    const options: Record<string, any> = {};
    if (credentials.accessToken) {
      options.headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.accessToken}`,
      };
    } else {
      options.data = {
        email: credentials.email,
        password: credentials.password,
      };
    }
    let response = await api.post("/auth/login", options);
    let data;
    if (response.error) {
      const { message } = response.data.header;
      if (message === "access token expired") {
        return { redirect: "/token/refresh" };
      }
      return rejectWithValue(response.data);
    }
    data = response.data.data[0];
    if (data.accessToken) {
      dispatch(authSlice.actions.setAccessToken(data.accessToken));
      delete data.accessToken;
    }
    return data;
  },
);

// logout sequence
const logoutUser = createAsyncThunk<
  boolean,
  Record<string, any>,
  { rejectValue: BEDataType }
>("auth/logout", async ({}, { rejectWithValue }) => {
  const response = await api.post("/auth/logout", {});
  if (response.error) {
    return rejectWithValue(response.data);
  }
  return true;
});

// message toggle
const toggleMessage = createAsyncThunk<
  Promise<void>,
  { autoHide: boolean; delay?: number },
  { dispatch: AppDispatchType }
>("auth/toggleMessage", async ({ autoHide, delay = 4000 }, { dispatch }) => {
  dispatch(authSlice.actions.showMessage());
  if (autoHide) {
    setTimeout(() => {
      dispatch(authSlice.actions.hideMessage());
    }, delay);
  }
});
const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: window.localStorage.getItem("accessToken") || null,
    isLoggedIn: false,
    isLoading: false,
    showMessage: false,
    message: null,
    user: null,
    error: null,
  },
  reducers: {
    setAccessToken: (state: AuthStateType, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      window.localStorage.setItem("accessToken", action.payload);
    },
    clearAccessToken: (state: AuthStateType) => {
      state.accessToken = null;
      window.localStorage.removeItem("accessToken");
    },
    setIsLoggedIn: (state: AuthStateType) => {
      if (!state.isLoggedIn) {
        state.isLoggedIn = true;
      }
    },
    unsetIsLoggedIn: (state: AuthStateType) => {
      if (state.isLoggedIn) {
        state.isLoggedIn = false;
      }
    },
    setMessage: (
      state: AuthStateType,
      action: PayloadAction<StoreMessageType>,
    ) => {
      console.log("setting auth state message!");
      state.message = action.payload;
    },
    clearMessage: (state: AuthStateType) => {
      state.message = null;
      state.showMessage = false;
    },
    showMessage: (state: AuthStateType) => {
      state.showMessage = true;
    },
    hideMessage: (state: AuthStateType) => {
      state.showMessage = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state: AuthStateType, { payload }) => {
        // console.log("LOGIN THUNK FULFILLED REDUCER PAYLOAD:", payload);
        const data = payload;
        state.user = data;
        state.isLoggedIn = data.redirect ? false : true;
        state.message = {
          type: data.redirect ? "info" : "success",
          role: "alert",
          description: data.redirect
            ? "hold on a little longer"
            : "login successful",
        };
        state.isLoading = data.redirect ? true : false;
      })
      .addCase(loginUser.pending, (state: AuthStateType) => {
        state.isLoading = true;
        state.message = {
          type: "info",
          role: "alert",
          description: "logging you in...",
        };
      })
      .addCase(loginUser.rejected, (state: AuthStateType, { payload }) => {
        // console.log("LOGIN THUNK REJECT REDUCER PAYLOAD", payload);
        const value = payload as BEDataType;
        state.isLoading = false;
        state.message = {
          type: "error",
          role: "alert",
          description: `${value.header.message}`,
          details: value.data,
          ...value.header,
        };
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.fulfilled, (state: AuthStateType) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.message = {
          type: "success",
          description: "log out successful",
          role: "alert",
        };
        state.user = null;
      })
      .addCase(logoutUser.pending, (state: AuthStateType) => {
        state.isLoading = true;
        state.message = {
          type: "info",
          role: "alert",
          description: "logging you out...",
        };
      })
      .addCase(logoutUser.rejected, (state: AuthStateType, { payload }) => {
        // console.log("LOGOUT THUNK REJECTED ERROR:", payload);
        const value = payload as BEDataType;
        state.message = {
          type: "error",
          role: "notification",
          description: `${value.header.message}`,
          details: value.data,
          ...value.header,
        };
        state.isLoading = false;
      });
  },
});

export { loginUser, logoutUser, toggleMessage };
export const {
  setAccessToken,
  clearAccessToken,
  setIsLoggedIn,
  unsetIsLoggedIn,
  setMessage,
  clearMessage,
  showMessage,
  hideMessage,
} = authSlice.actions;
export default authSlice.reducer;
