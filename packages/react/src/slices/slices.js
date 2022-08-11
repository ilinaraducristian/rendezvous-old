import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // value: 0,
  user: {
    id: "123",
    name: "Alex Jmekerul",
    friendship: [{ id: "69", userId: "124", status: "pending" }],
  },
};

const test = [{ name:""}, {age: " "}]
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
