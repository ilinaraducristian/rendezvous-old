import { FriendshipDto, FriendshipMessageDto, FriendshipStatusDto } from "@rendezvous/common";
import { computed, makeObservable, observable } from "mobx";
import { fetchAuthApiJson } from "../api";
import keycloak from "../keycloak";
import { FriendshipMessage } from "./message";
import MessagesParent from "./messages-parent";

class Friendship extends MessagesParent<FriendshipMessage> {
  user1Id: string;
  user2Id: string;
  status: FriendshipStatusDto;

  constructor(friendshipDto: FriendshipDto) {
    super(friendshipDto.id, `friendships/${friendshipDto.id}`);
    this.user1Id = friendshipDto.user1Id;
    this.user2Id = friendshipDto.user2Id;
    this.status = friendshipDto.status;
    makeObservable(this, {
      user1Id: observable,
      user2Id: observable,
      status: observable,
      friendId: computed
    });
  }

  get friendId(): string {
    return this.user1Id === keycloak.subject ? this.user2Id : this.user1Id;
  }

  async apiUpdate(status: Omit<FriendshipStatusDto, "pending">) {
    await fetchAuthApiJson(this.url, {method: "PUT", body: { status }});
  }

  async apiGetMessages(offset: number = 0): Promise<[string, FriendshipMessage][]> {
    const response = await fetchAuthApiJson<FriendshipMessageDto[]>(`${this.url}/messages?offset=${offset}`);
    return response.map((messageDto) => [messageDto.id, new FriendshipMessage(messageDto)]);
  }
}

export default Friendship;
