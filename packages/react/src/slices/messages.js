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
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter((message) => {
        return message.id !== action.payload;
      });
    },
  },
});

export const { createMessages, addMessages, deleteMessage } =
  messagesSlice.actions;

export default messagesSlice.reducer;
