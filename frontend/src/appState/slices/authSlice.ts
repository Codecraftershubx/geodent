import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  AppDispatchType,
  AuthStateType,
  BEDataType,
  BEDataHeaderType,
  LoginSuccessPaylodType,
  MessageType,
  RefreshSuccessPayloadType,
} from "@/utils/types.js";
import api from "@/utils/api.js";

type LoginCredentialsType = {
  accessToken?: string | null;
  email?: string | null;
  password?: string | null;
};

// login user
const loginUser = createAsyncThunk<
  LoginSuccessPaylodType,
  LoginCredentialsType,
  { rejectValue: BEDataHeaderType; dispatch: AppDispatchType }
>(
  "auth/login",
  async (credentials: LoginCredentialsType, { rejectWithValue, dispatch }) => {
    console.log("LOGIN THUNK CALLED WITH DATA:", credentials);
    const options: Record<string, any> = {};
    if (credentials.accessToken) {
      options.headers = {
        Authorization: `Bearer ${credentials.accessToken}`,
      };
    } else {
      options.extras = {
        data: {
          email: credentials.email,
          password: credentials.password,
        },
      };
    }
    let response = await api.post("/auth/login", options);
    let data;
    if (response.error) {
      if (response.content.header.errno === 10) {
        dispatch(authSlice.actions.setIsLoggedIn());
      }
      return rejectWithValue(response.content.header);
    }
    data = response.content.data[0];
    if (data.accessToken) {
      dispatch(authSlice.actions.setAccessToken(data.accessToken));
      delete data.accessToken;
    }
    return data;
  }
);

// logout sequence
const logoutUser = createAsyncThunk<
  boolean,
  Record<string, any>,
  { rejectValue: BEDataType }
>("auth/logout", async ({ accessToken }, { rejectWithValue }) => {
  const response = await api.post("/auth/logout", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("logoutUser response", response);
  if (response.error) {
    return rejectWithValue(response.content);
  }
  return true;
});

// refresh token
const refreshAccessToken = createAsyncThunk<
  RefreshSuccessPayloadType,
  string,
  { rejectValue: BEDataType; dispatch: AppDispatchType }
>("auth/refresh", async (token: string, { rejectWithValue }) => {
  const response = await api.post("/auth/refresh", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.error) {
    return rejectWithValue(response.content);
  }
  const data: RefreshSuccessPayloadType = response.content.data[0];
  return data;
});

// message toggle
const toggleMessage = createAsyncThunk<
  Promise<void>,
  { autoHide: boolean; delay?: number },
  { dispatch: AppDispatchType }
>("auth/toggleMessage", async ({ autoHide, delay = 2000 }, { dispatch }) => {
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
    clearIsLoggedIn: (state: AuthStateType) => {
      state.isLoggedIn = false;
      window.localStorage.setItem(
        "isLoggedIn",
        JSON.stringify(state.isLoggedIn)
      );
    },
    setIsLoggedIn: (state: AuthStateType) => {
      state.isLoggedIn = true;
      window.localStorage.setItem(
        "isLoggedIn",
        JSON.stringify(state.isLoggedIn)
      );
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
        const data = payload;
        state.user = data;
        state.isLoggedIn = true;
        state.isLoading = false;
        window.localStorage.setItem(
          "isLoggedIn",
          JSON.stringify(state.isLoggedIn)
        );
        if (state.accessToken !== payload.accessToken) {
          state.accessToken = payload.accessToken;
        }
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
        window.localStorage.setItem(
          "isLoggedIn",
          JSON.stringify(state.isLoggedIn)
        );
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

export { loginUser, logoutUser, refreshAccessToken, toggleMessage };
export const {
  setAccessToken,
  clearAccessToken,
  setMessage,
  clearMessage,
  showMessage,
  hideMessage,
  setIsLoading,
  stopIsLoading,
} = authSlice.actions;

export default authSlice.reducer;
