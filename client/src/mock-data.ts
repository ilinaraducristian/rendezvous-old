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
  serverId: 1,
  name: "Text channels"
}], [2, {
  id: 2,
  serverId: 1,
  name: "Voice channels"
}]]);

export const mockChannels = new SortedMap<Channel>([[1, {
  id: 1,
  serverId: 1,
  groupId: 1,
  type: ChannelType.Text,
  name: "general"
}], [2, {
  id: 2,
  serverId: 1,
  groupId: 2,
  type: ChannelType.Voice,
  name: "General"
}]]);

export const mockMessages = new SortedMap<Message>([[1, {
  id: 1,
  serverId: 1,
  channelId: 1,
  userId: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
  timestamp: new Date(),
  text: "a message",
}]]);

export const mockMembers = new SortedMap<Member>([[1, {
  id: 1,
  serverId: 1,
  userId: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4"
}]]);

export const mockServers = new SortedMap<Server>([[1, {
  id: 1,
  name: "Server",
  userId: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
  invitation: null,
  invitationExp: null
}]]);
