import SortedMap from "./SortedMap";
import {Channel, Group, Member, Server, ServersData, User} from "../types";

export function responseToSortedMap(response: any): ServersData {
  response.servers = new SortedMap<Server>(response.servers);
  response.channels = new SortedMap<Channel>(response.channels);
  response.groups = new SortedMap<Group>(response.groups);
  response.members = new SortedMap<Member>(response.members);
  response.users = new Map<string, User>(response.users);
  return response;
}