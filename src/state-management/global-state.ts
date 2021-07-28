import SortedMap from "../util/SortedMap";
import {Channel, Group, Member, Message, Server, UsersMap} from "../types";
import {createContext, Dispatch} from "react";
import {Device} from "mediasoup-client";

const initialState = {
  servers: new SortedMap<Server>(),
  channels: new SortedMap<Channel>(),
  groups: new SortedMap<Group>(),
  messages: new SortedMap<Message>(),
  members: new SortedMap<Member>(),
  users: new UsersMap(),
  selectedServer: {id: null},
  selectedChannel: {id: null},
  overlay: null,
  device: new Device(),
  remoteStream: new MediaStream()
};

const GlobalStates = createContext<GlobalContextType>({
  state: initialState, dispatch: () => {
  }
});

export type Action = {
  type: string,
  payload?: any | ((oldState: any) => any)
}

export type GlobalStatesType = {
  servers: SortedMap<Server>,
  channels: SortedMap<Channel>,
  groups: SortedMap<Group>,
  messages: SortedMap<Message>,
  members: SortedMap<Member>,
  users: UsersMap,
  selectedServer: { id: number | null },
  selectedChannel: { id: number | null },
  overlay: any,
  device: Device,
  remoteStream: MediaStream
}

export type GlobalContextType = {
  state: GlobalStatesType, dispatch: Dispatch<Action>
}

export {initialState, GlobalStates};