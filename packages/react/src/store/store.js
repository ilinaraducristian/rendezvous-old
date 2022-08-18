import { configureStore } from "@reduxjs/toolkit";
import slice from "../slices/slices";

export const store = configureStore({
  reducer: {
    userData: slice,
  },
});
