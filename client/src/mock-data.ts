import SortedMap from "./util/SortedMap";

export const mockUsers = new Map([["97a8ffc2-10cd-47dd-b915-cf8243d5bfc4", {
  id: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
  username: "user1",
  firstName: "Firstname",
  lastName: "Lastname"
}]]);

export const mockGroups = new SortedMap([[1, {
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

export const mockChannels = new SortedMap([[1, {
  id: 1,
  server_id: 1,
  group_id: 1,
  type: "text",
  name: "general",
  order: 0
}], [2, {
  id: 2,
  server_id: 1,
  group_id: 2,
  type: "voice",
  name: "General",
  order: 0
}], [3, {
  id: 3,
  server_id: 1,
  group_id: null,
  type: "text",
  name: "genpop",
  order: 1
}], [4, {
  id: 4,
  server_id: 1,
  group_id: null,
  type: "text",
  name: "gata",
  order: 0
}]]);

export const mockMessages = new SortedMap([[1, {
  id: 1,
  channel_id: 1,
  user_id: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
  timestamp: new Date(),
  text: "test message",
}]]);

export const mockMembers = new SortedMap([[1, {
  id: 1,
  server_id: 1,
  user_id: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4"
}]]);

export const mockServers = new SortedMap([[1, {
  id: 1,
  name: "test server",
  user_id: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
}]]);
