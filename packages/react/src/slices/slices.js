import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const slice = createSlice({
  name: "basic",
  initialState,
  reducers: {
    basicSlice: (state, action) => {
      console.log(action.payload);
    },
  },
});

export const { basicSlice } = slice.actions;

export default slice.reducer;
