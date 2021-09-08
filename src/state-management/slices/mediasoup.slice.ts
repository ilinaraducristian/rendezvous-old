import {createSlice} from "@reduxjs/toolkit";
import {SliceCaseReducers} from "@reduxjs/toolkit/src/createSlice";
import {localStream} from "../../mediasoup";

export type MediasoupSliceState = {
  isLoaded: boolean,
  isMuted: boolean
}

export const mediasoupSlice = createSlice<MediasoupSliceState, SliceCaseReducers<MediasoupSliceState>, string>({
  name: "mediasoup",
  initialState: {
    isLoaded: false,
    isMuted: false
  },
  reducers: {
    load(state: MediasoupSliceState) {
      state.isLoaded = true;
    },
    toggleMute(state: MediasoupSliceState) {
      if (localStream === undefined) return;
      localStream.getAudioTracks().forEach(track => {
        track.enabled = state.isMuted;
      })
      state.isMuted = !state.isMuted;
    }
  }
});

export const {load, toggleMute} = mediasoupSlice.actions;

export default mediasoupSlice.reducer;