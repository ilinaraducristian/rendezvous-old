import SortedMap from "./util/SortedMap";
import {Channel, ChannelType, Group, Member, Message, Server, User} from "./types";

export const mockUsers = new Map<string, User>([["97a8ffc2-10cd-47dd-b915-cf8243d5bfc4", {
  id: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
  username: "user1",
  firstName: "Firstname",
  lastName: "Lastname"
}]]);

export const mockGroups = new SortedMap<Group>([[1, {
  id: 1,
  server_id: 1,
  name: "Text channels",
  order: 0
}], [2, {
  id: 2,
  server_id: 1,
  name: "Voice channels",
  order: 1
}]]);

export const mockChannels = new SortedMap<Channel>([[1, {
  id: 1,
  server_id: 1,
  group_id: 1,
  type: ChannelType.Text,
  name: "general",
  order: 0,
}], [2, {
  id: 2,
  server_id: 1,
  group_id: 2,
  type: ChannelType.Voice,
  name: "General",
  order: 0,
}]]);

export const mockMessages = new SortedMap<Message>([[1, {
  id: 1,
  server_id: 1,
  channel_id: 1,
  user_id: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
  timestamp: new Date(),
  text: "a message",
}]]);

export const mockMembers = new SortedMap<Member>([[1, {
  id: 1,
  server_id: 1,
  user_id: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4"
}]]);

export const mockServers = new SortedMap<Server>([[1, {
  id: 1,
  name: "Server",
  user_id: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
  invitation: null,
  invitation_exp: null,
  order: 0
}]]);
