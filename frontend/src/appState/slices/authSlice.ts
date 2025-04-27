import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../utils/types.js";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedIn: (state: RootState) => {
            state.isLoggedIn = true;
        }
    }
});


export const { setIsLogged } = authSlice.actions;
export default authSlice.reducer;
