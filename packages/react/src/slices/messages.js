import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

export const messagesSlice = createSlice({
  name: "messagesData",
  initialState,
  reducers: {
    createMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessages: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
  },
});

export const { createMessages, addMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
