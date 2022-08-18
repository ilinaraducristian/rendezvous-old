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
    outgoingFriendship: (state, action) => {
      state.user = {
        ...state.user,
        friendships: {
          ...state.user.friendships,
          outgoing: [
            ...state.user.friendships.outgoing,
            action.payload,
          ],
        },
      };
    },
    incomingFriendship: (state, action) => {
      state.user = {
        ...state.user,
        friendships: {
          ...state.user.friendships,
          incoming: [
            ...state.user.friendships.incoming,
            action.payload,
          ],
        },
      };
    },
    getUsersData: (state, action) => {
      state.user = {
        ...state.user,
        users: action.payload,
      };
    },
    deleteIncomingFriendship: (state, action) => {
      state.user = {
        ...state.user,
        friendships: {
          ...state.user.friendships,
          incoming: state.user.friendships.incoming.filter(
            (friendship) => {
              return friendship.id !== action.payload;
            }
          ),
        },
      };
    },
    deleteOutgoingFriendship: (state, action) => {
      state.user = {
        ...state.user,
        friendships: {
          ...state.user.friendships,
          outgoing: state.user.friendships.outgoing.filter(
            (friendship) => {
              return friendship.id !== action.payload;
            }
          ),
        },
      };
    },
    acceptIncomingFriendshipRequest: (state, action) => {
      state.user.friendships.incoming.forEach((friendship) => {
        if (friendship.id === action.payload) {
          friendship.status = "accepted";
        }
      });
    },
    acceptOutgoingFriendshipRequest: (state, action) => {
      state.user.friendships.outgoing.forEach((friendship) => {
        if (friendship.id === action.payload) {
          friendship.status = "accepted";
        }
      });
    },
  },
});

export const {
  userModel,
  outgoingFriendship,
  incomingFriendship,
  getUsersData,
  deleteIncomingFriendship,
  deleteOutgoingFriendship,
  acceptIncomingFriendshipRequest,
  acceptOutgoingFriendshipRequest,
} = slice.actions;

export default slice.reducer;
