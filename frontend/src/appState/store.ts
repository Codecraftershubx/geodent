import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import appMessageReducer from "./slices/appMessageSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    appMessage: appMessageReducer,
  },
});

export default store;
