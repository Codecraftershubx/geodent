import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatchType, AuthStateType, BEDataType, RootState } from "../../utils/types.js";
import api from "../../utils/api.js";

type LoginCredentialsType = {
    accessToken?: string | null;
    email?: string | null;
    password?: string | null;
}

type RequestErrorType = Record<string, any>;

const loginUser = createAsyncThunk<BEDataType, LoginCredentialsType, { rejectValue: RequestErrorType, dispatch: AppDispatchType }>("auth/login", async (credentials: LoginCredentialsType, { rejectWithValue, dispatch }) => {
    console.log("LOGIN THUNK CALLED WITH:", credentials);
    const options: Record<string, any> = {};
    if (credentials.accessToken) {
        options.headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${credentials.accessToken}`,
        }
    } else {
        options.data = {
            email: credentials.email,
            password: credentials.password,
        };
    }
    const response = await api.post("/auth/login", options);
    if (response.error) {
        console.error("LOGIN THUNK ERROR:", response.error);
        return rejectWithValue(response.data);
    }
    console.log("LOGIN THUNK SUCCESS:", response.data);
    if (response.data.accessToken) {
        dispatch(authSlice.actions.setAccessToken(response.data.accessToken));
        delete response.data.accessToken;
    }
    return response.data;
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        accessToken: window.localStorage.getItem("accessToken") || null,
        isLoggedIn: false,
        isLoading: false,
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
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state: AuthStateType,  { payload }) => {
                console.log("login paylod:", payload);
                const data = payload;
                state.user = data;
                state.isLoggedIn = true;
                state.error = null;
                state.isLoading = false;
            })
        .addCase(loginUser.pending, (state: AuthStateType) => {
            state.isLoading = true;
        })
        .addCase(loginUser.rejected, (state: AuthStateType, { payload }) => {
            console.log(payload);
            state.isLoading = false;
            //state.error = payload;
            state.isLoggedIn = false;
        })
    }
});

export { loginUser };
export const { setIsLoggedIn, unsetIsLoggedIn } = authSlice.actions;
export default authSlice.reducer;
