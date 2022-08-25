import { configureStore } from "@reduxjs/toolkit";
import slice from "../slices/slices";
import messagesSlice from "../slices/messages";

export const store = configureStore({
  reducer: {
    userData: slice,
    messagesData: messagesSlice,
  },
});
