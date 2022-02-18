import { makeObservable, observable } from "mobx";
import { fetchApi, fetchJson } from "../api";
import FriendshipDTO from "../dtos/friendship";
import FriendshipStatus from "../dtos/friendship-status";
import { FriendshipMessageDto } from "../dtos/message";
import { FriendshipMessage } from "./message";
import MessagesParent from "./messages-parent";

class Friendship extends MessagesParent<FriendshipMessage> {
  user1Id: string;
  user2Id: string;
  status: FriendshipStatus;

  constructor(friendshipDto: FriendshipDTO) {
    super(friendshipDto.id, `friendships/${friendshipDto.id}`);
    this.user1Id = friendshipDto.user1Id;
    this.user2Id = friendshipDto.user2Id;
    this.status = friendshipDto.status;
    makeObservable(this, {
      user1Id: observable,
      user2Id: observable,
      status: observable,
    });
  }

  async apiUpdate(status: Omit<FriendshipStatus, "pending">) {
    await fetchApi(this.url, "PUT", { status });
  }

  async apiGetMessages(offset: number = 0): Promise<[string, FriendshipMessage][]> {
    const response = await fetchJson<FriendshipMessageDto[]>(`${this.url}/messages?offset=${offset}`);
    return response.map((messageDto) => [messageDto.id, new FriendshipMessage(messageDto)]);
  }
}

export default Friendship;
