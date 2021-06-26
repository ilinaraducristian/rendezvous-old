import SortedMap from "./util/SortedMap";
import {Action, Channel, GlobalContextType, GlobalStatesType, Group, Member, Message, Server, User} from "./types";
import {createContext} from "react";

const initialState = {
  servers: new SortedMap<Server>(),
  channels: new SortedMap<Channel>(),
  groups: new SortedMap<Group>(),
  messages: new SortedMap<Message>(),
  members: new SortedMap<Member>(),
  users: new Map<string, User>(),
  selectedServer: null,
  selectedChannel: null,
  overlay: null,
};

const GlobalStates = createContext<GlobalContextType>({
  state: initialState, dispatch: () => {
  }
});

function updateState(state: any, obj: string, payload: any | Function) {
  if (typeof payload === "function") {
    state[obj] = payload(state[obj]);
  } else {
    state[obj] = payload;
  }
}

enum Actions {
  SERVERS_SET = "SERVERS_SET",
  CHANNELS_SET = "CHANNELS_SET",
  GROUPS_SET = "GROUPS_SET",
  MESSAGES_SET = "MESSAGES_SET",
  MEMBERS_SET = "MEMBERS_SET",
  USERS_SET = "USERS_SET",
  SERVER_SELECTED = "SERVER_SELECTED",
  CHANNEL_SELECTED = "CHANNEL_SELECTED",
  OVERLAY_SET = "OVERLAY_SET",
}

function reducer(state: GlobalStatesType, action: Action) {
  let found: any;
  switch (action.type) {
    case Actions.SERVERS_SET:
      updateState(state, "servers", action.payload);
      if (state.selectedServer === null) break;
      found = state.servers.get(state.selectedServer.id);
      if (found === undefined) {
        /*
         * if server was deleted from the state
         * remove it from selected server and remove the channel
         */
        state.selectedChannel = null;
        state.selectedServer = null;
        break;
      }
      state.selectedServer = found;
      break;
    case Actions.CHANNELS_SET:
      updateState(state, "channels", action.payload);
      if (state.selectedChannel === null) break;
      found = state.channels.get(state.selectedChannel.id);
      if (found === undefined) {
        /*
         * if Channel was deleted from the state
         * remove it from selected Channel and remove the channel
         */
        state.selectedChannel = null;
        break;
      }
      state.selectedChannel = found;
      break;
    case Actions.GROUPS_SET:
      updateState(state, "groups", action.payload);
      break;
    case Actions.MESSAGES_SET:
      updateState(state, "messages", action.payload);
      break;
    case Actions.MEMBERS_SET:
      updateState(state, "members", action.payload);
      break;
    case Actions.USERS_SET:
      updateState(state, "users", action.payload);
      break;
    case Actions.SERVER_SELECTED:
      updateState(state, "selectedServer", action.payload);
      break;
    case Actions.CHANNEL_SELECTED:
      updateState(state, "selectedChannel", action.payload);
      break;
    case Actions.OVERLAY_SET:
      updateState(state, "overlay", action.payload);
      break;
    default:
      throw new Error(`${action.type} action not defined`);
  }
  return state;
}

export {initialState, GlobalStates, Actions, reducer};