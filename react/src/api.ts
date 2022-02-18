import config from "./config";
import FriendshipDTO from "./dtos/friendship";
import UserDataResponse from "./dtos/getDataResponse";
import ServerDto from "./dtos/server";
import Friendship from "./entities/friendship";
import Server from "./entities/server";
import keycloak from "./keycloak";
import OrderedMap from "./ordered-map";

export function fetchApi(path: string): Promise<Response>;
export function fetchApi(path: string, method: string): Promise<Response>;
export function fetchApi(path: string, method: string, body: any): Promise<Response>;
export function fetchApi(path: string, method?: string, body?: any) {
  const headers = {
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
      "Content-Type": "application/json",
    },
    method,
    body: JSON.stringify(body),
  };
  return fetch(`${config.backendURL}/${path}`, headers);
}

export function fetchJson<R = any>(path: string): Promise<R>;
export function fetchJson<R = any>(path: string, method: string): Promise<R>;
export function fetchJson<R = any>(path: string, method: string, body: any): Promise<R>;
export function fetchJson<R = any>(path: string, method?: string, body?: any) {
  if (method === undefined) return fetchApi(path).then((r) => r.json()) as Promise<R>;
  return fetchApi(path, method, body).then((r) => r.json()) as Promise<R>;
}

const Api = {
  async getData() {
    const userDataDto = await fetchJson<UserDataResponse>(`users/data`);

    return {
      servers: new OrderedMap(userDataDto.servers.map((serverDto) => [serverDto.id, new Server(serverDto)])),
      friendships: new OrderedMap(userDataDto.friendships.map((friendshipDto) => [friendshipDto.id, new Friendship(friendshipDto)])),
    };
  },
  async newServer(name: string) {
    const serverDto = await fetchJson<ServerDto>(`servers`, "POST", { name });
    return new Server(serverDto);
  },
  async newMessageReaction(
    ids: {
      friendshipId?: string;
      serverId?: string;
      groupId?: string;
      channelId?: string;
    },
    messageId: string,
    emoji: string,
    serverEmoji?: boolean
  ) {
    let URL = `friendships/${ids.friendshipId}/messages/${messageId}/reactions`;
    if (ids.friendshipId === undefined)
      URL = `servers/${ids.serverId}/groups/${ids.groupId}/channels/${ids.channelId}/messages/${messageId}/reactions`;
    await fetchApi(URL, "POST", {
      emoji,
      serverEmoji: ids.friendshipId === undefined ? undefined : serverEmoji,
    });
  },
  async newFriendship(userId: string): Promise<Friendship> {
    return fetchJson(`friendships`, "POST", { userId }).then((friendshipDto: FriendshipDTO) => new Friendship(friendshipDto));
  },
  async joinServer(invitation: string) {
    const serverDto = await fetchJson(`users/servers`, "POST", { invitation });
    return new Server(serverDto);
  },
};
export default Api;
