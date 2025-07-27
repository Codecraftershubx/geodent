import { ListingsStateType } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";

/**
 * Listings App State
 */
const listingsSlice = createSlice({
  name: "listings",
  initialState: {
    isLoading: false,
  },
  /**
   * Reducers
   */
  reducers: {
    setIsLoading: (state: ListingsStateType) => {
      state.isLoading = true;
    },
    stopIsLoading: (state: ListingsStateType) => {
      state.isLoading = false;
    },
  },

  /**
   * @func extraReducers
   * Extra reducers
   */
  extraReducers: (_) => {},
});

/**
 * Exports
 */
export const { setIsLoading, stopIsLoading } = listingsSlice.actions;
export default listingsSlice.reducer;
