import {createSlice} from "@reduxjs/toolkit";

export const mediasoupSlice = createSlice({
  name: "mediasoup",
  initialState: {
    loaded: false
  },
  reducers: {
    load(state) {
      state.loaded = true;
    }
  }
});

export const {load} = mediasoupSlice.actions;

export default mediasoupSlice.reducer;