import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatchType, StoreMessageType } from "../../utils/types.js";

const messageSlice = createSlice({
  name: "appMessage",
  initialState: {
    message: null,
    show: false,
  },
  reducers: {
    setAppMessage: (
      state: MessageStateType,
      action: PayloadAction<StoreMessageType>,
    ) => {
      state.message = action.payload;
    },
    showAppMessage: (state: MessageStateType) => {
      state.show = true;
    },
    hideAppMessage: (state: MessageStateType) => {
      state.show = false;
    },
    clearAppMessage: (state: MessageStateType) => {
      state.message = null;
      state.show = false;
    },
  },
});

type MessageStateType = {
  message: StoreMessageType | null;
  show: boolean;
};

// Extra reducers
const toggleAppMessage = createAsyncThunk<
  Promise<void>,
  { autoHide: boolean; delay?: number },
  { dispatch: AppDispatchType }
>("appMessage/toggle", async ({ autoHide, delay = 4000 }, { dispatch }) => {
  dispatch(messageSlice.actions.showAppMessage());
  if (autoHide) {
    setTimeout(() => {
      dispatch(messageSlice.actions.hideAppMessage());
    }, delay);
  }
});

export { toggleAppMessage };
export const {
  setAppMessage,
  clearAppMessage,
  showAppMessage,
  hideAppMessage,
} = messageSlice.actions;
