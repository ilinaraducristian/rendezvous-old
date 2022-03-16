import { FriendshipDto, ServerDto, UserDataResponse } from "@rendezvous/common";
import Friendship from "./entities/friendship";
import Server from "./entities/server";
import User from "./entities/user";
import keycloak from "./keycloak";
import OrderedMap from "./ordered-map";

type RequestInitialization = Omit<RequestInit, "body"> & { body?: any };

export function fetchAuth(input: RequestInfo, init?: RequestInitialization) {
  const _init = {
    ...init,
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
      "Content-Type": "application/json",
    },
  };
  _init.body = JSON.stringify(_init.body);
  return fetch(input, _init);
}

export function fetchAuthJson<R = any>(input: RequestInfo, init?: RequestInitialization) {
  return fetchAuth(input, init).then((response) => response.json()) as Promise<R>;
}

export function fetchAuthApi(path: string, init?: RequestInitialization) {
  return fetchAuth(`${process.env.REACT_APP_API_URL}/${path}`, init);
}

export function fetchAuthApiJson<R = any>(path: string, init?: RequestInitialization) {
  return fetchAuthJson<R>(`${process.env.REACT_APP_API_URL}/${path}`, init);
}

class Api {
  async getData() {
    const userDataDto = await fetchAuthApiJson<UserDataResponse>(`users/data`);

    return {
      servers: new OrderedMap(userDataDto.servers.map((serverDto) => [serverDto.id, new Server(serverDto)])),
      friendships: new OrderedMap(userDataDto.friendships.map((friendshipDto) => [friendshipDto.id, new Friendship(friendshipDto)])),
      users: new Map(userDataDto.users.map((userDto) => [userDto.id, new User(userDto)])),
    };
  }

  async newServer(name: string) {
    const serverDto = await fetchAuthApiJson<ServerDto>(`servers`, { method: "POST", body: { name } });
    return new Server(serverDto);
  }

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
    await fetchAuthApi(URL, {
      method: "POST",
      body: {
        emoji,
        serverEmoji: ids.friendshipId === undefined ? undefined : serverEmoji,
      },
    });
  }

  async newFriendship(userId: string): Promise<Friendship> {
    return fetchAuthApiJson(`friendships`, { method: "POST", body: { userId } }).then(
      (friendshipDto: FriendshipDto) => new Friendship(friendshipDto)
    );
  }

  async joinServer(invitation: string) {
    const serverDto = await fetchAuthApiJson(`users/servers`, { method: "POST", body: { invitation } });
    return new Server(serverDto);
  }
}

export default new Api();
