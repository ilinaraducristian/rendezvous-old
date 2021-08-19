import {createSlice} from "@reduxjs/toolkit";

export const socketioSlice = createSlice({
  name: "socketio",
  initialState: {
    connected: false
  },
  reducers: {
    connect(state) {
      state.connected = true;
    },
    disconnect(state) {
      state.connected = false;
    }
  }
});

export const {connect, disconnect} = socketioSlice.actions;
export const selectConnected = (state: any): boolean => state.socketio.connected;

export default socketioSlice.reducer;