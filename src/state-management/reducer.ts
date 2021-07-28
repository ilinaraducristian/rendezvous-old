import {UsersMap} from "../types";
import Actions from "./actions";
import {Action, GlobalStatesType} from "./global-state";

function reducer(state: GlobalStatesType, action: Action) {
  let found: any;
  switch (action.type) {
    case Actions.SERVERS_SET:
      updateState(state, "servers", action.payload.clone());
      if (state.selectedServer.id === null) break;
      found = state.servers.get(state.selectedServer.id);
      if (found === undefined) {
        /*
         * if server was deleted from the state
         * remove it from selected server and remove the channel
         */
        state.selectedChannel.id = null;
        state.selectedServer.id = null;
        break;
      }
      state.selectedServer = {id: state.selectedServer.id};
      break;
    case Actions.CHANNELS_SET:
      updateState(state, "channels", action.payload.clone());
      if (state.selectedChannel.id === null) break;
      found = state.channels.get(state.selectedChannel.id);
      if (found === undefined) {
        /*
         * if Channel was deleted from the state
         * remove it from selected Channel and remove the channel
         */
        state.selectedChannel.id = null;
        break;
      }
      state.selectedChannel = {id: state.selectedChannel.id};
      break;
    case Actions.GROUPS_SET:
      updateState(state, "groups", action.payload.clone());
      break;
    case Actions.MESSAGES_SET:
      updateState(state, "messages", action.payload.clone());
      break;
    case Actions.MEMBERS_SET:
      updateState(state, "members", action.payload.clone());
      break;
    case Actions.USERS_SET:
      updateState(state, "users", new UsersMap(action.payload));
      break;
    case Actions.INITIAL_DATA_GATHERED:
      updateState(state, "servers", action.payload.servers.clone());
      updateState(state, "channels", action.payload.channels.clone());
      updateState(state, "groups", action.payload.groups.clone());
      updateState(state, "members", action.payload.members.clone());
      updateState(state, "users", new UsersMap(action.payload.users));
      break;
    case Actions.SERVER_ADDED:
      updateState(state, "servers", state.servers.concat(action.payload.servers).clone());
      updateState(state, "channels", state.channels.concat(action.payload.channels).clone());
      updateState(state, "groups", state.groups.concat(action.payload.groups).clone());
      updateState(state, "members", state.members.concat(action.payload.members).clone());
      updateState(state, "users", new UsersMap(action.payload.users));
      break;
    case Actions.CHANNEL_ADDED:
      updateState(state, "channels", state.channels.set(action.payload.id, action.payload).clone());
      break;
    case Actions.GROUP_ADDED:
      updateState(state, "groups", state.groups.set(action.payload.id, action.payload).clone());
      break;
    case Actions.SERVER_SELECTED:
      updateState(state, "selectedServer", {id: action.payload});
      break;
    case Actions.CHANNEL_SELECTED:
      updateState(state, "selectedChannel", {id: action.payload});
      break;
    case Actions.OVERLAY_SET:
      updateState(state, "overlay", action.payload);
      break;
    case Actions.MESSAGES_ADDED:
      updateState(state, "messages", state.messages.concat(action.payload));
      break;
    case Actions.DEVICE_LOADED:
      // const channel = (state.channels.get(action.payload.id) as Channel);
      // channel.users = [...(channel.users as any[])]
      break;
    default:
      throw new Error(`${action.type} action not defined`);
  }
  return {...state};
}

function updateState(state: any, obj: string, payload: any | Function) {
  if (typeof payload === "function") {
    state[obj] = payload(state[obj]);
  } else {
    state[obj] = payload;
  }
}

export default reducer;