import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  AppDispatchType,
  AuthStateType,
  BEDataHeaderType,
  MessageType,
  LoginSuccessPayloadType,
  RefreshSuccessPayloadType,
  LoginCredentialsType,
} from "@/utils/types.js";

import { RequestApi } from "@/utils/api/requestApi";
import { assertIsDefined } from "@/utils/assertions";
const api = RequestApi.getClient();

/**
 * @function loginUser
 * @descrition Redux async thun to log in a user from the application
 * @param credentials[object] credentials for logout auth
 * @param thunkapi createAsyncThunk api class
 * @returns { object {accessToken: string} } data on login success
 */
const loginUser = createAsyncThunk<
  LoginSuccessPayloadType,
  LoginCredentialsType,
  { rejectValue: BEDataHeaderType; dispatch: AppDispatchType }
>(
  "auth/login",
  async (
    credentials: LoginCredentialsType,
    { rejectWithValue, dispatch, getState }
  ) => {
    const options: Record<string, any> = {};
    // add auth headers if access token is sent
    if (credentials.accessToken) {
      options.headers = {
        Authorization: `Bearer ${credentials.accessToken}`,
      };
    } else {
      // add credentials if no access token
      options.extras = {
        data: {
          email: credentials.email,
          password: credentials.password,
        },
      };
    }
    // make request to server
    let response = await api.post("/auth/login", options);
    let data;
    // handle unauthorised requests
    if (response.error) {
      switch (response.content.header.errno) {
        case 2:
          dispatch(authSlice.actions.clearStorage());
          break;
      }
      // reject request
      return rejectWithValue(response.content.header);
    }
    // extract access token and update state
    const state = getState() as AuthStateType;
    assertIsDefined(response.content.data);
    data = response.content?.data[0] as LoginSuccessPayloadType;
    if (state.accessToken !== data.accessToken) {
      dispatch(authSlice.actions.setAccessToken(data.accessToken));
    }
    // forward data to caller
    return data;
  }
);

/**
 * @function logoutUser
 * @descrition Redux async thun to log out a user from the application
 * @param accessToken access token to use for logout auth
 * @param thunkapi createAsyncThunk api class
 * @returns { boolean } true on logout success, and false otherwise
 */
const logoutUser = createAsyncThunk<
  boolean,
  string,
  { rejectValue: BEDataHeaderType }
>("auth/logout", async (accessToken, { rejectWithValue, dispatch }) => {
  // make request with auth header
  const response = await api.post("/auth/logout", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // handle expired sessions: ie refresh tokens and other errors
  if (response.error) {
    switch (response.content.header.errno) {
      case 9:
        dispatch(authSlice.actions.clearStorage());
        break;
    }
    return rejectWithValue(response.content.header);
  }
  // return on success
  return true;
});

/**
 * @function refreshAccessToken
 * @description Redux async thun to handle expired tokens refresh
 * @param accessToken access token to use for logout auth
 * @param thunkapi createAsyncThunk api class
 * @returns { RefreshSuccessPayloadType } an object containing the accessToken as key on success
 * @returns { BEDataHeaderType } an object with error details on error
 */
const refreshAccessToken = createAsyncThunk<
  RefreshSuccessPayloadType,
  string,
  { rejectValue: BEDataHeaderType; dispatch: AppDispatchType }
>("auth/refresh", async (token: string, { rejectWithValue, dispatch }) => {
  // add auth header and make request to server
  const response = await api.post("/auth/refresh", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // handle refresh failure
  if (response.error) {
    return rejectWithValue(response.content.header);
  }
  // update store with new access token
  assertIsDefined(response.content.data);
  const data = response.content.data[0] as RefreshSuccessPayloadType;
  dispatch(authSlice.actions.setAccessToken(data.accessToken));
  // return response data
  return data;
});

/**
 * @function toggleMessage
 * @description Redux async thunk to display or hide auth messages
 * @param accessToken access token to use for logout auth
 * @param thunkapi createAsyncThunk api class
 * @returns { RefreshSuccessPayloadType } an object containing the accessToken as key on success
 * @returns { BEDataHeaderType } an object with error details on error
 */
const toggleMessage = createAsyncThunk<
  Promise<void>,
  AppMessageArgsType,
  { dispatch: AppDispatchType }
>("auth/toggleMessage", async (options, { dispatch }) => {
  const mode = options?.mode ?? "on";
  const autoHide = options?.autoHide ?? false;
  const delay = options?.delay ?? 5000;
  if (mode === "on") {
    dispatch(authSlice.actions.showMessage());
    if (autoHide) {
      setTimeout(() => {
        dispatch(authSlice.actions.hideMessage());
      }, delay);
    }
  } else {
    setTimeout(() => dispatch(authSlice.actions.hideMessage(), delay));
  }
});

/**
 * @name authSlice
 * @description Redux auth slice
 */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: window.localStorage.getItem("accessToken") || null,
    isLoggedIn: window.localStorage.getItem("isLoggedIn") === "true",
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
    toggleIsLoggedIn: (
      state: AuthStateType,
      action: PayloadAction<boolean>
    ) => {
      state.isLoggedIn = action.payload;
      window.localStorage.setItem("isLoggedIn", state.isLoggedIn.toString());
    },
    setMessage: (state: AuthStateType, action: PayloadAction<MessageType>) => {
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
    clearStorage: (state: AuthStateType) => {
      state.accessToken = null;
      state.isLoggedIn = false;
      state.user = null;
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("isLoggedIn");
    },
    setIsLoading: (state: AuthStateType) => {
      state.isLoading = true;
    },
    stopIsLoading: (state: AuthStateType) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state: AuthStateType, { payload }) => {
        console.log("LOGIN THUNK FULFILLED REDUCER PAYLOAD:", payload);
        state.isLoggedIn = true;
        state.isLoading = false;
        window.localStorage.setItem(
          "isLoggedIn",
          JSON.stringify(state.isLoggedIn)
        );
      })
      .addCase(loginUser.pending, (state: AuthStateType) => {
        console.log("LOGIN PENDING HANDLER");
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state: AuthStateType, { payload }) => {
        console.log("LOGIN THUNK REJECT REDUCER PAYLOAD", payload);
        state.isLoggedIn = false;
        if (payload?.errno === 5 || payload?.errno === 10) {
          state.isLoading = true;
        } else {
          state.isLoading = false;
        }
      })
      .addCase(logoutUser.fulfilled, (state: AuthStateType) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
        window.localStorage.setItem("isLoggedIn", JSON.stringify(false));
      })
      .addCase(logoutUser.pending, (state: AuthStateType) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state: AuthStateType) => {
        // console.log("LOGOUT THUNK REJECTED ERROR:", payload);
        state.isLoading = false;
      })
      .addCase(
        refreshAccessToken.fulfilled,
        (state: AuthStateType, { payload }) => {
          state.accessToken = payload.accessToken;
        }
      )
      .addCase(refreshAccessToken.rejected, (state: AuthStateType) => {
        state.accessToken = null;
      });
  },
});

/**
 * ======
 * Types
 * ======
 */

/**
 * App Message Args Type
 */
type AppMessageArgsType =
  | {
      autoHide?: boolean;
      delay?: number;
      mode?: "on" | "off";
    }
  | undefined;

export { loginUser, logoutUser, refreshAccessToken, toggleMessage };
export const {
  setAccessToken,
  clearAccessToken,
  clearStorage,
  setMessage,
  clearMessage,
  showMessage,
  hideMessage,
  setIsLoading,
  stopIsLoading,
  toggleIsLoggedIn,
} = authSlice.actions;

export default authSlice.reducer;
