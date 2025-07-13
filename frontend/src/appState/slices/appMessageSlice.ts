import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatchType, MessageType } from "../../utils/types.js";

const appMessageSlice = createSlice({
  name: "appMessage",
  initialState: {
    message: null,
    show: false,
  },
  reducers: {
    setAppMessage: (
      state: AppMessageType,
      action: PayloadAction<MessageType>
    ) => {
      console.log("setting app message...");
      state.message = action.payload;
    },
    showAppMessage: (state: AppMessageType) => {
      console.log("\tshowing app message");
      state.show = true;
    },
    hideAppMessage: (state: AppMessageType) => {
      console.log("\thiding app message");
      state.show = false;
    },
    clearAppMessage: (state: AppMessageType) => {
      state.message = null;
      state.show = false;
    },
  },
});

// Extra reducers
const toggleAppMessage = createAsyncThunk<
  Promise<void>,
  { autoHide?: boolean; delay?: number },
  { dispatch: AppDispatchType }
>(
  "appMessage/toggle",
  async ({ autoHide = true, delay = 4000 }, { dispatch }) => {
    console.log("toggling app message");
    const state = appMessageSlice.getInitialState();
    if (!state.show) {
      dispatch(appMessageSlice.actions.showAppMessage());
      if (autoHide) {
        setTimeout(() => {
          dispatch(appMessageSlice.actions.hideAppMessage());
        }, delay);
      }
    } else {
      dispatch(appMessageSlice.actions.hideAppMessage());
    }
  }
);

type AppMessageType = {
  message: MessageType | null;
  show: boolean;
};

export { toggleAppMessage };
export const {
  setAppMessage,
  clearAppMessage,
  showAppMessage,
  hideAppMessage,
} = appMessageSlice.actions;
export default appMessageSlice.reducer;
export type { AppMessageType };
