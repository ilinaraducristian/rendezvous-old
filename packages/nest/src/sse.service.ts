import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { ConversationDto, FriendshipDto } from "./entities/user-data.dto";
import MessageEvent from "./message-event";
import SseEvents from "./sse-events";

@Injectable()
export class SseService {
  private readonly sse$ = new Subject<MessageEvent & { userId: string }>();

  get sse() {
    return this.sse$.asObservable();
  }

  private next(value: MessageEvent & { userId: string }) {
    this.sse$.next(value);
  }

  friendRequest(userId: string, friendshipDto: FriendshipDto) {
    return this.next({
      type: SseEvents.friendRequest, userId: userId, data: friendshipDto
    });
  }

  acceptFriendshipRequest(userId: string, id: string) {
    return this.next({ type: SseEvents.friendRequestAccepted, userId, data: { id } })
  }

  deleteFriendship(userId: string, id: string) {
    return this.next({ type: SseEvents.friendshipDeleted, userId, data: { id } });
  }

  friendshipMessage(userId: string, message: ConversationDto) {
    return this.next({
      type: SseEvents.friendshipMessage, userId, data: message
    });
  }

  deleteFriendshipMessage(userId: string, friendshipId: string, id: string) {
    return this.next({ type: SseEvents.friendshipMessageDeleted, userId, data: { friendshipId, id } });
  }

}
