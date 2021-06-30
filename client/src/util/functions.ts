import SortedMap from "./SortedMap";
import {Channel, Group, Member, ProcessedServersData, Server, ServersData, User} from "../types";

export function responseToSortedMap(response: ServersData): ProcessedServersData {
  return {
    servers: new SortedMap<Server>(response.servers),
    channels: new SortedMap<Channel>(response.channels),
    groups: new SortedMap<Group>(response.groups),
    members: new SortedMap<Member>(response.members),
    users: new Map<string, User>(response.users),
  };
}