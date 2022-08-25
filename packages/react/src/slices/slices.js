import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};

export const slice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    userModel: (state, action) => {
      state.user = action.payload;
    },
    addFriendship: (state, action) => {
      state.user = {
        ...state.user,
        friendships: [...state.user.friendships, action.payload],
      };
    },
    addUser: (state, action) => {
      if (state.user.users.length > 0) {
        state.user.users.forEach((user) => {
          if (user.id !== action.payload.id) {
            state.user = {
              ...state.user,
              users: [...state.user.users, action.payload],
            };
          }
        });
      } else {
        state.user = {
          ...state.user,
          users: [...state.user.users, action.payload],
        };
      }
    },
    deleteFriendship: (state, action) => {
      state.user = {
        ...state.user,
        friendships: state.user.friendships.filter((friendship) => {
          return friendship.id !== action.payload;
        }),
      };
    },
    acceptFriendship: (state, action) => {
      state.user.friendships.forEach((friendship) => {
        if (friendship.id === action.payload) {
          friendship.status = "accepted";
        }
      });
    },
    setConversation: (state, action) => {
      if (state.user.conversations.length > 0) {
        state.user.conversations.forEach((user) => {
          if (user.friendshipId !== action.payload.friendshipId) {
            state.user = {
              ...state.user,
              conversations: [
                ...state.user.conversations,
                action.payload,
              ],
            };
          } else {
            user.userId = action.payload.userId;
            user.text = action.payload.text;
          }
        });
      } else {
        state.user = {
          ...state.user,
          conversations: [
            ...state.user.conversations,
            action.payload,
          ],
        };
      }
    },
  },
});

export const {
  userModel,
  deleteFriendship,
  acceptFriendship,
  addUser,
  addFriendship,
  setConversation,
} = slice.actions;

export default slice.reducer;
