import {ProcessedServersData, ServersData} from "../types";

export function responseToSortedMap(response: ServersData): ProcessedServersData {
  return {
    servers: response.servers,
    users: response.users,
  };
}