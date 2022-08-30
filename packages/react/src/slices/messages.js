import { createSlice } from "@reduxjs/toolkit";

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
    updateMessage: (state, action) => {
      console.log(action.payload);
      state.messages.forEach((message) => {
        if (message.id === action.payload.message.id) {
          message.text = action.payload.newText;
        }
      });
    },
  },
});

export const {
  createMessages,
  addMessages,
  deleteMessage,
  updateMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
