import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import appMessageReducer from "./slices/appMessageSlice.js";
import ListingsReducer from "./slices/listingsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    appMessage: appMessageReducer,
    listings: ListingsReducer,
  },
});

export default store;
