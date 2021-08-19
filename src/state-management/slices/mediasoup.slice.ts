import {createSlice} from "@reduxjs/toolkit";
import {SliceCaseReducers} from "@reduxjs/toolkit/src/createSlice";

type MediasoupSliceState = {
  isLoaded: boolean
}

export const mediasoupSlice = createSlice<MediasoupSliceState, SliceCaseReducers<MediasoupSliceState>, string>({
  name: "mediasoup",
  initialState: {
    isLoaded: false
  },
  reducers: {
    load(state) {
      state.isLoaded = true;
    }
  }
});

export const {load} = mediasoupSlice.actions;

export default mediasoupSlice.reducer;